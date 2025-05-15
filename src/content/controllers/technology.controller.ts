import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  ParseUUIDPipe,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { TechnologyService } from '../technology.service';
import { CreateTechnologyDto } from '../dto/create-technology.dto';
import { UpdateTechnologyDto } from '../dto/update-technology.dto';
import { mapTechnologyToDto, TechnologyResponseDto } from '../dto/response-technology.dto';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Project Technologies')
@Controller('/api/projects/:project_id/technologies')
export class TechnologyController {
  constructor(private readonly techService: TechnologyService) {}

  @Post()
  @ApiOperation({
    summary: 'Add technology to project',
    description: 'Creates and associates a new technology with the specified project',
  })
  @ApiParam({
    name: 'project_id',
    type: String,
    description: 'Project UUID',
    example: 'a178acac-db03-4a67-a33b-31caaa4e590d',
  })
  @ApiBody({ type: CreateTechnologyDto })
  @ApiCreatedResponse({
    description: 'Technology successfully created and added to project',
    type: TechnologyResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid request data',
  })
  @ApiNotFoundResponse({
    description: 'Project not found',
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to create technology',
  })
  async create(
    @Param('project_id', ParseUUIDPipe) projectId: string,
    @Body() createTechDto: CreateTechnologyDto
  ) {
    const tech = await this.techService.createForProject(projectId, createTechDto);

    if (!tech) {
      throw new HttpException('Technology creation failed', 500);
    }

    return mapTechnologyToDto(tech);
  }

  @Get()
  @ApiOperation({
    summary: 'Get project technologies',
    description: 'Returns all technologies associated with the specified project',
  })
  @ApiParam({
    name: 'project_id',
    type: String,
    description: 'Project UUID',
    example: 'a178acac-db03-4a67-a33b-31caaa4e590d',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    enum: ['frontend', 'backend', 'tool', 'database'],
    description: 'Filter technologies by category',
  })
  @ApiOkResponse({
    description: 'Technologies retrieved successfully',
    type: [TechnologyResponseDto],
  })
  @ApiNotFoundResponse({
    description: 'Project not found or has no technologies',
  })
  async findAllForProject(
    @Param('project_id', ParseUUIDPipe) projectId: string,
    @Query('category') category?: string
  ) {
    const techs = await this.techService.findAllByProject(projectId, { category });

    if (!techs) {
      throw new HttpException('Technologies not found', HttpStatus.NOT_FOUND);
    }

    return techs.map(mapTechnologyToDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get project technology by ID',
    description: 'Returns a specific technology associated with the project',
  })
  @ApiParam({
    name: 'project_id',
    type: String,
    description: 'Project UUID',
    example: 'a178acac-db03-4a67-a33b-31caaa4e590d',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Technology ID',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Technology retrieved successfully',
    type: TechnologyResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Project or technology not found',
  })
  async findOne(
    @Param('project_id', ParseUUIDPipe) projectId: string,
    @Param('id', ParseIntPipe) id: number
  ) {
    const tech = await this.techService.findOneInProject(projectId, id);

    if (!tech) {
      throw new HttpException('Technology not found', HttpStatus.NOT_FOUND);
    }

    return mapTechnologyToDto(tech);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update project technology',
    description: 'Updates a specific technology associated with the project',
  })
  @ApiParam({
    name: 'project_id',
    type: String,
    description: 'Project UUID',
    example: 'a178acac-db03-4a67-a33b-31caaa4e590d',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Technology ID',
    example: 1,
  })
  @ApiBody({ type: UpdateTechnologyDto })
  @ApiOkResponse({
    description: 'Technology updated successfully',
    type: TechnologyResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Project or technology not found',
  })
  @ApiBadRequestResponse({
    description: 'Invalid update data',
  })
  async update(
    @Param('project_id', ParseUUIDPipe) projectId: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTechDto: UpdateTechnologyDto
  ) {
    const tech = await this.techService.findOneInProject(projectId, id);

    if (!tech) {
      throw new HttpException('Technology not found', HttpStatus.NOT_FOUND);
    }
    
    return this.techService.updateInProject(projectId, id, updateTechDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remove technology from project',
    description: 'Removes a specific technology association from the project',
  })
  @ApiParam({
    name: 'project_id',
    type: String,
    description: 'Project UUID',
    example: 'a178acac-db03-4a67-a33b-31caaa4e590d',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Technology ID',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Technology successfully removed from project',
    type: TechnologyResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Project or technology not found',
  })
  async remove(
    @Param('project_id', ParseUUIDPipe) projectId: string,
    @Param('id', ParseIntPipe) id: number
  ) {
    const tech = await this.techService.findOneInProject(projectId, id);

    if (!tech) {
      throw new HttpException('Technology not found', HttpStatus.NOT_FOUND);
    }
    
    const technology = await this.techService.removeFromProject(projectId, id);

    return mapTechnologyToDto(technology);
  }
}