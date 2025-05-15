import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Technology } from './entities/technology.entity';
import { Project } from './entities/project.entity';
import { CreateTechnologyDto } from './dto/create-technology.dto';
import { UpdateTechnologyDto } from './dto/update-technology.dto';

@Injectable()
export class TechnologyService {
  constructor(
    @InjectRepository(Technology)
    private techRepository: Repository<Technology>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>
  ) { }

  async create(createTechDto: CreateTechnologyDto): Promise<Technology> {
    const technology = this.techRepository.create(createTechDto);
    return this.techRepository.save(technology);
  }

  async findAll(): Promise<Technology[]> {
    return this.techRepository.find({
      order: { name: 'ASC' }
    });
  }

  async createForProject(projectId: string, createTechDto: CreateTechnologyDto) {
    const project = await this.projectRepository.findOneBy({ id: projectId });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const technology = this.techRepository.create({
      ...createTechDto,
      projects: [project]
    });

    return this.techRepository.save(technology);
  }

  async findAllByProject(projectId: string, filters?: { category?: string }) {
    const query = this.techRepository
      .createQueryBuilder('tech')
      .innerJoin('tech.projects', 'project', 'project.id = :projectId', { projectId })
      .leftJoinAndSelect('tech.projects', 'projects');

    if (filters?.category) {
      query.andWhere('tech.category = :category', { category: filters.category });
    }

    return query.getMany();
  }

  async findOneInProject(projectId: string, techId: number) {
    const tech = await this.techRepository
      .createQueryBuilder('tech')
      .innerJoin('tech.projects', 'project', 'project.id = :projectId', { projectId })
      .where('tech.id = :techId', { techId })
      .getOne();

    if (!tech) {
      throw new NotFoundException('Technology not found in this project');
    }
    return tech;
  }

  async updateInProject(projectId: string, techId: number, updateTechDto: UpdateTechnologyDto) {
    await this.findOneInProject(projectId, techId);
    await this.techRepository.update(techId, updateTechDto);
    return this.techRepository.findOneBy({ id: techId });
  }

  async removeFromProject(projectId: string, techId: number) {
    const tech = await this.findOneInProject(projectId, techId);
    return await this.techRepository.remove(tech);
  }
}