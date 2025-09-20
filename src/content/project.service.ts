import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Technology } from './entities/technology.entity';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';


@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Technology)
    private readonly technologyRepository: Repository<Technology>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private async invalidateCacheByKey(key: string) {
    await this.cacheManager.del(key);
  }

  private getCacheKeyByAuthor(authorId: string): string {
    return `product_${authorId}`;
  }

  private getCacheKeyById(id: string): string {
    return `product_${id}`;
  }

  async create(createProjectDto: CreateProjectDto, author: { id: string; username?: string }): Promise<Project> {
    const { technologyIds, ...projectData } = createProjectDto;

    const technologies = await this.technologyRepository.findBy({
      id: In(technologyIds || []),
    });

    const project = this.projectRepository.create({
      ...projectData,
      author: { id: author.id },
      technologies,
    });

    return await this.projectRepository.save(project);
  }

  async findAll(): Promise<Project[]> {
    return await this.projectRepository.find({
      relations: ['author', 'technologies'],
    });
  }

  async findOne(id: string): Promise<Project> {
    const cached: Project | null | undefined = await this.cacheManager.get(
      this.getCacheKeyById(id),
    );
    if (cached) {
      return cached;
    }

    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['author', 'technologies'],
    });

    await this.cacheManager.set(this.getCacheKeyById(id), project);

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async findByAuthorId(authorId: string): Promise<Project[]> {
    const cached: Project[] | null | undefined = await this.cacheManager.get(
      this.getCacheKeyByAuthor(authorId),
    );
    if (cached) {
      return cached;
    }

    const projects = await this.projectRepository.find({
      where: { author: { id: authorId } },
      relations: ['author', 'technologies'],
    });

    await this.cacheManager.set(this.getCacheKeyByAuthor(authorId), projects);

    return projects;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const { technologyIds, ...updateData } = updateProjectDto;
    const project = await this.findOne(id);

    if (technologyIds) {
      project.technologies = await this.technologyRepository.findBy({
        id: In(technologyIds),
      });
    }

    this.projectRepository.merge(project, updateData);

    await this.invalidateCacheByKey(this.getCacheKeyById(id));

    return await this.projectRepository.save(project);
  }

  async remove(id: string): Promise<any> {
    const project = await this.findOne(id);

    if (project) {
      await this.invalidateCacheByKey(this.getCacheKeyById(id));
    }

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    await this.technologyRepository.remove(project.technologies);
    return await this.projectRepository.remove(project);
  }

  async incrementViews(id: string): Promise<void> {
    await this.projectRepository.increment({ id }, 'views', 1);
  }
}