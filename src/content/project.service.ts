import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Project } from './entities/project.entity';
import { User } from '../user/entities/user.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Technology } from './entities/technology.entity';


@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Technology)
    private readonly technologyRepository: Repository<Technology>,
  ) { }

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
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['author', 'technologies'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async findByAuthorId(authorId: string): Promise<Project[]> {
    return await this.projectRepository.find({
      where: { author: { id: authorId } },
      relations: ['author', 'technologies'],
    });
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
    return await this.projectRepository.save(project);
  }

  async remove(id: string): Promise<any> {
    const project = await this.findOne(id);

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