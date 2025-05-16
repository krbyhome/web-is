import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TechnologyService } from './technology.service';
import { mapTechnologyToModel, TechnologyModel } from './dto/models/technology.model';
import { mapPaginationInputToDto, PaginationInput } from '../common/dto/pagination.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateTechnologyInput, mapCreateTechnologyInputToDto } from './dto/create-technology.input';
import { TechnologyPaginatedResponse } from './dto/responses/paginated-technolody.model';
import { mapUpdateTechnologyInputToDto, UpdateTechnologyInput } from './dto/update-technology.input';

@Resolver(() => TechnologyModel)
export class TechnologyResolver {
  constructor(private readonly technologyService: TechnologyService) {}

  @Mutation(() => TechnologyModel)
  async createTechnology(
    @Args('data') data: CreateTechnologyInput,
  ): Promise<TechnologyModel> {
    try {
      const dto = mapCreateTechnologyInputToDto(data);
      const technology = await this.technologyService.create(dto);
      return mapTechnologyToModel(technology);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Query(() => [TechnologyModel])
  async technologies() {
    const result = await this.technologyService.findAll();

    return result.map(mapTechnologyToModel);
  }

  @Query(() => TechnologyModel)
  async technologyByProject(@Args('projectId') projectId: string, @Args('id') id: number): Promise<TechnologyModel> {
    const result = await this.technologyService.findOneInProject(projectId, id);

    if (!result) {
      throw new HttpException('Technology not found', HttpStatus.NOT_FOUND);
    }

    return mapTechnologyToModel(result);
  }

  @Mutation(() => TechnologyModel)
  async updateTechnology(
    @Args('projectId') projectId: string,
    @Args('data') data: UpdateTechnologyInput,
  ): Promise<TechnologyModel> {
    const dto = mapUpdateTechnologyInputToDto(data);
    const result = await this.technologyService.updateInProject(projectId, data.technologyId, dto);

    if (!result) {
      throw new HttpException('Technology not found', HttpStatus.NOT_FOUND);
    }

    return mapTechnologyToModel(result);
  }

  @Mutation(() => TechnologyModel)
  async removeTechnology(@Args('projectId') projectId: string, @Args('id') id: number): Promise<TechnologyModel> {
    const result = await this.technologyService.removeFromProject(projectId, id);

    if (!result) {
      throw new HttpException('Technology not found', HttpStatus.NOT_FOUND);
    }

    return mapTechnologyToModel(result);
  }
}