import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { mapProjectToModel, ProjectModel } from './dto/models/project.model';
import { mapPaginationInputToDto, PaginationInput } from '../common/dto/pagination.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectInput, mapCreateProjectInputToDto } from './dto/create-project.input';
import { CustomSession } from 'src/middleware/auth.middleware';
import { ProjectPaginatedResponse } from './dto/responses/paginated-project.model';
import { mapUpdateProjectInputToDto, UpdateProjectInput } from './dto/update-project.input';


@Resolver(() => ProjectModel)
export class ProjectsResolver {
  constructor(private readonly projectsService: ProjectService) {}

  @Mutation(() => ProjectModel)
  async createProject(
    @Args('data') data: CreateProjectInput,
    @Args('userId') userId: string,
  ): Promise<ProjectModel> {
    try {
      const dto = mapCreateProjectInputToDto(data);
      const project = await this.projectsService.create(dto, {id: userId});
      return mapProjectToModel(project);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Query(() => [ProjectModel])
  async projects(
  ) {
    const result = await this.projectsService.findAll();
    return result.map(mapProjectToModel);
  }

  @Query(() => ProjectModel)
  async project(@Args('id') id: string): Promise<ProjectModel> {
    const result = await this.projectsService.findOne(id);

    if (!result) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }

    return mapProjectToModel(result);
  }

  @Mutation(() => ProjectModel)
  async updateProject(
    @Args('data') data: UpdateProjectInput,
  ): Promise<ProjectModel> {
    const dto = mapUpdateProjectInputToDto(data);
    const result = await this.projectsService.update(data.projectId, dto);

    if (!result) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }

    return mapProjectToModel(result);
  }

  @Mutation(() => ProjectModel)
  async removeProject(@Args('id') id: string): Promise<ProjectModel> {
    const result = await this.projectsService.remove(id);

    if (!result) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }

    return mapProjectToModel(result);
  }

  @Query(() => [ProjectModel])
  async userProjects(
    @Args('userId') userId: string,
  ): Promise<ProjectModel[]> {
    const projects = await this.projectsService.findByAuthorId(userId);
    return projects.map(mapProjectToModel);
  }
}