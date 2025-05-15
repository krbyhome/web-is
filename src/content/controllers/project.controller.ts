import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseUUIDPipe,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { ProjectService } from '../project.service';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { CustomSession } from 'src/middleware/auth.middleware';
import { User } from 'src/user/entities/user.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { CreateNotificationDto } from 'src/notifications/dto/create-notification.dto';
import { ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { mapProjectToDto, ProjectListResponseDto, ProjectResponseDto } from '../dto/response-project.dto';

@ApiTags('Projects')
@Controller('api/projects')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly notificationService: NotificationsService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create project',
    description: 'Creates a new project for the authenticated user',
  })
  @ApiBody({
    type: CreateProjectDto,
    description: 'Project creation data',
  })
  @ApiCreatedResponse({
    description: 'Project created successfully',
    type: ProjectResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - User not logged in',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @Req() req: Request & { session: CustomSession },
  ) {
    if (!req.session.userId) {
      return null;
    }

    const project = await this.projectService.create(createProjectDto, {
      id: req.session.userId,
      username: req.session.username,
    });

    project.author.name = req.session.username!;

    const notifyDto = new CreateNotificationDto();
    notifyDto.user_id = req.session.userId;
    notifyDto.message = `Ты завел проект ${project.id}`;
    await this.notificationService.create(notifyDto);

    return mapProjectToDto(project);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all projects',
    description: 'Returns list of all public projects',
  })
  @ApiOkResponse({
    description: 'Projects retrieved successfully',
    type: ProjectListResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'No projects found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async findAll(): Promise<ProjectListResponseDto> {
    const projects = await this.projectService.findAll();

    if (!projects) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    
    return {
      data: projects.map(mapProjectToDto),
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get project by ID',
    description: 'Returns project details by ID and increments view counter',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Project UUID',
    example: 'a178acac-db03-4a67-a33b-31caaa4e590d',
  })
  @ApiOkResponse({
    description: 'Project retrieved successfully',
    type: ProjectResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Project not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const project = await this.projectService.findOne(id);
    
    if (!project) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    await this.projectService.incrementViews(id);
    return mapProjectToDto(project);
  }

  @Get('view/my')
  @ApiOperation({
    summary: 'Get current user projects',
    description: 'Returns all projects for the authenticated user',
  })
  @ApiOkResponse({
    description: 'Projects retrieved successfully',
    type: ProjectListResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - User not logged in',
  })
  @ApiNotFoundResponse({
    description: 'No projects found for current user',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async getUserProjects(@Req() req: Request & { session: CustomSession }): Promise<ProjectListResponseDto> {
    if (!req.session.userId) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const projects = await this.projectService.findByAuthorId(req.session.userId);

    if (!projects) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    return {
      data: projects.map(mapProjectToDto)
    };
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: 'Get projects by user ID',
    description: 'Returns all public projects for specified user ID',
  })
  @ApiParam({
    name: 'userId',
    type: String,
    description: 'User UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'Projects retrieved successfully',
    type: ProjectListResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'No projects found for specified user',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async getOtherUserProjects(
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    const projects = await this.projectService.findByAuthorId(userId);

    if (!projects) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    return {
      data: projects.map(mapProjectToDto)
    };
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update project',
    description: 'Updates existing project. Only project author can update.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Project UUID',
    example: 'a178acac-db03-4a67-a33b-31caaa4e590d',
  })
  @ApiBody({
    type: UpdateProjectDto,
    description: 'Project update data',
  })
  @ApiOkResponse({
    description: 'Project updated successfully',
    type: ProjectResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - User not logged in',
  })
  @ApiNotFoundResponse({
    description: 'Project not found or it is not user project',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Req() req: Request & { session: CustomSession },
  ) {
    if (!req.session.userId) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const project = await this.projectService.update(id, updateProjectDto);

    if (!project || project.author.id !== req.session.userId) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    const notifyDto = new CreateNotificationDto();
    notifyDto.user_id = project.author.id;
    notifyDto.message = `Ты обновил проект ${project.id}`;
    await this.notificationService.create(notifyDto);

    return mapProjectToDto(project);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete project',
    description: 'Deletes existing project. Only project author can delete.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Project UUID',
    example: 'a178acac-db03-4a67-a33b-31caaa4e590d',
  })
  @ApiOkResponse({
    description: 'Project deleted successfully',
    type: ProjectResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - User not logged in',
  })
  @ApiNotFoundResponse({
    description: 'Project not found or it is not user project',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request & { session: CustomSession },
  ) {
    if (!req.session.userId) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const project = await this.projectService.remove(id);

    if (!project) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    const notifyDto = new CreateNotificationDto();
    notifyDto.user_id = project.author.id;
    notifyDto.message = `Ты удалил проект ${project.id}`;
    await this.notificationService.create(notifyDto);

    return mapProjectToDto(project);
  }
}
