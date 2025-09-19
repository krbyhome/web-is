import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { mapProjectToModel, ProjectModel } from './dto/models/project.model';
import { mapPaginationInputToDto, PaginationInput } from '../common/dto/pagination.dto';
import { HttpException, HttpStatus, ParseUUIDPipe } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectInput, mapCreateProjectInputToDto } from './dto/create-project.input';
import { CustomSession } from 'src/middleware/auth.middleware';
import { ProjectPaginatedResponse } from './dto/responses/paginated-project.model';
import { mapUpdateProjectInputToDto, UpdateProjectInput } from './dto/update-project.input';
import { GraphQLError } from 'graphql';


@Resolver(() => ProjectModel)
export class ProjectsResolver {
  constructor(private readonly projectsService: ProjectService) {}

  @Mutation(() => ProjectModel)
  async createProject(
    @Args('data') data: CreateProjectInput,
    @Args('userId', new ParseUUIDPipe({
      exceptionFactory: () => new GraphQLError('INVALID_UUID', {
        extensions: {
          code: 'BAD_REQUEST',
          status: 400
        }
      })
    })) userId: string,
  ): Promise<ProjectModel> {
    try {
      const dto = mapCreateProjectInputToDto(data);
      const project = await this.projectsService.create(dto, {id: userId});
      return mapProjectToModel(project);
    } catch (error) {
      throw new GraphQLError(error.message, {
        extensions: {
          code: error.status,
          status: error.status,
        }
      });
    }
  }

  @Query(() => [ProjectModel])
  async projects(
  ) {
    const result = await this.projectsService.findAll();
    return result.map(mapProjectToModel);
  }

  @Query(() => ProjectModel)
  async project(@Args('id', new ParseUUIDPipe({
      exceptionFactory: () => new GraphQLError('INVALID_UUID', {
        extensions: {
          code: 'BAD_REQUEST',
          status: 400
        }
      })
    })) id: string): Promise<ProjectModel> {
    try {
      const result = await this.projectsService.findOne(id);
      return mapProjectToModel(result);
    } catch (error) {
      throw new GraphQLError(error.message, {
        extensions: {
          code: error.status,
          status: error.status
        }
      });
    }
  }

  @Mutation(() => ProjectModel)
  async updateProject(
    @Args('data') data: UpdateProjectInput,
  ): Promise<ProjectModel> {
    const dto = mapUpdateProjectInputToDto(data);
    try {
      const result = await this.projectsService.update(data.projectId, dto);
      return mapProjectToModel(result);
    } catch (error) {
      throw new GraphQLError(error.message, {
        extensions: {
          code: error.status,
          status: error.status
        }
      });
    }
  }

  @Mutation(() => ProjectModel)
  async removeProject(@Args('id', new ParseUUIDPipe({
      exceptionFactory: () => new GraphQLError('INVALID_UUID', {
        extensions: {
          code: 'BAD_REQUEST',
          status: 400
        }
      })
    })) id: string): Promise<ProjectModel> {
    try {
      const result = await this.projectsService.remove(id);
      return mapProjectToModel(result);
    } catch (error) {
      throw new GraphQLError(error.message, {
        extensions: {
          code: error.status,
          status: error.status
        }
      });
    }
  }

  @Query(() => [ProjectModel])
  async userProjects(
    @Args('userId', new ParseUUIDPipe({
      exceptionFactory: () => new GraphQLError('INVALID_UUID', {
        extensions: {
          code: 'BAD_REQUEST',
          status: 400
        }
      })
    })) userId: string,
  ): Promise<ProjectModel[]> {
    try {
      const projects = await this.projectsService.findByAuthorId(userId);
      return projects.map(mapProjectToModel);
    } catch (error) {
      throw new GraphQLError(error.message, {
        extensions: {
          code: error.status,
          status: error.status
        }
      });
    }
  }
}