import { Controller, Get, Render, Param, Req, Res, Post, Body, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomSession } from '../../middleware/auth.middleware';
import { ProjectService } from '../project.service';
import { TechnologyService } from '../technology.service';
import { CommentService } from 'src/interactions/comment.service';
import { UserService } from 'src/user/user.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { CreateNotificationDto } from 'src/notifications/dto/create-notification.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { CacheControl } from 'src/common/decorators/cache-controll.decorator';

@Controller('projects')
export class ProjectMvcController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly techService: TechnologyService,
    private readonly commentService: CommentService,
    private readonly userService: UserService,
    private readonly notificationService: NotificationsService
  ) { }

  @Get()
  @Render('pages/projects/list')
  @CacheControl(5)
  async listProjects(@Req() req: Request & { session: CustomSession }) {
    try {
      let projects;

      if (req.query.authorId) {
        projects = await this.projectService.findByAuthorId(req.query.authorId as string);
      } else if (req.session.userId && req.query.my) {
        projects = await this.projectService.findByAuthorId(req.session.userId);
      } else {
        projects = await this.projectService.findAll();
      }

      return {
        title: 'Проекты',
        projects: await this.enrichProjectsData(projects),
        isAuthenticated: !!req.session.userId,
        currentUserId: req.session.userId,
        styles: ['project-list.css'],
        layout: 'layouts/main'
      };
    } catch (error) {
      console.error('Error loading projects:', error);
      return {
        error: 'Не удалось загрузить проекты',
        isAuthenticated: !!req.session.userId,
        styles: ['project-list.css'],
        layout: 'layouts/main'
      };
    }
  }

  @Get('view/:id')
  @Render('pages/projects/view')
  @CacheControl(5)
  async viewProject(
    @Param('id') id: string,
    @Req() req: Request & { session: CustomSession }
  ) {
    try {
      const project = await this.projectService.findOne(id);
      const [technologies, comments, authorProjects] = await Promise.all([
        this.techService.findAllByProject(id),
        this.commentService.findByProjectId(id),
        this.projectService.findByAuthorId(project.author.id)
      ]);

      await this.projectService.incrementViews(id);

      return {
        title: project.title,
        project,
        technologies,
        comments,
        authorProjects,
        isAuthenticated: !!req.session.userId,
        currentUser: req.session.userId,
        isAuthor: req.session.userId === project.author.id,
        styles: ['project-view.css'],
        layout: 'layouts/main'
      };
    } catch (error) {
      console.error('Error loading project:', error);
      return {
        error: 'Проект не найден',
        isAuthenticated: !!req.session.userId,
        styles: ['project-view.css'],
        layout: 'layouts/main'
      };
    }
  }

  private async enrichProjectsData(projects: any[]) {
    return Promise.all(projects.map(async project => {
      const technologies = await this.techService.findAllByProject(project.id);
      const commentCount = await this.commentService.getCountByProject(project.id);

      return {
        ...project,
        technologies,
        commentCount,
        stack: technologies.map(t => t.name)
      };
    }));
  }

  @Get('new')
  @Render('pages/projects/new')
  @CacheControl(2)
  async newProjectForm(@Req() req: Request & { session: CustomSession }) {
    if (!req.session.userId) {
      return { redirect: '/login' };
    }

    return {
      title: 'Создать новый проект',
      isAuthenticated: true,
      currentUserId: req.session.userId,
      styles: ['project-new.css'],
      layout: 'layouts/main'
    };
  }

  @Post()
  @CacheControl(2)
  async createProject(
    @Req() req: Request & { session: CustomSession },
    @Res() res: Response,
    @Body() formData: {
      title: string;
      description: string;
      techNames: string[];
      techCategories: string[];
      githubLink?: string;
      demoLink?: string;
    }
  ) {
    if (!req.session.userId) {
      throw new UnauthorizedException();
    }

    const technologyIds: number[] = [];
    for (let i = 0; i < formData.techNames.length; i++) {
      if (formData.techNames[i].trim()) {
        const tech = await this.techService.create({
          name: formData.techNames[i].trim(),
          category: formData.techCategories[i] || 'tool'
        });
        technologyIds.push(tech.id);
      }
    }

    const project = await this.projectService.create(
      {
        title: formData.title,
        description: formData.description,
        githubLink: formData.githubLink,
        demoLink: formData.demoLink,
        technologyIds
      },
      { id: req.session.userId, username: req.session.username }
    );

    const notifyDto = new CreateNotificationDto();
    notifyDto.user_id = req.session.userId;
    notifyDto.message = `Ты завел проект ${project.id}`;
    await this.notificationService.create(notifyDto);

    res.redirect(`/projects/view/${project.id}`)
  }

  @Get('edit/:id')
  @Render('pages/projects/edit')
  @CacheControl(2)
  async editProjectForm(
    @Param('id') id: string,
    @Req() req: Request & { session: CustomSession }
  ) {
    if (!req.session.userId) {
      return { redirect: '/login' };
    }

    try {
      const project = await this.projectService.findOne(id);
      const technologies = await this.techService.findAllByProject(id);

      if (project.author.id !== req.session.userId) {
        throw new ForbiddenException('Вы не можете редактировать этот проект');
      }

      return {
        title: 'Редактировать проект',
        project,
        technologies,
        isAuthenticated: true,
        currentUserId: req.session.userId,
        styles: ['project-new.css'],
        layout: 'layouts/main'
      };
    } catch (error) {
      console.error('Error loading project for edit:', error);
      return {
        error: 'Не удалось загрузить проект для редактирования',
        isAuthenticated: !!req.session.userId,
        styles: ['project-new.css'],
        layout: 'layouts/main'
      };
    }
  }

  @Post('edit/:id')
  async updateProject(
    @Param('id') id: string,
    @Req() req: Request & { session: CustomSession },
    @Res() res: Response,
    @Body() formData: {
      title: string;
      description: string;
      techNames: string[];
      techCategories: string[];
      githubLink?: string;
      demoLink?: string;
    }
  ) {
    if (!req.session.userId) {
      throw new UnauthorizedException();
    }

    try {
      const project = await this.projectService.findOne(id);
      if (project.author.id !== req.session.userId) {
        throw new ForbiddenException('Вы не можете редактировать этот проект');
      }

      const technologyIds: number[] = [];
      for (let i = 0; i < formData.techNames.length; i++) {
        if (formData.techNames[i].trim()) {
          const tech = await this.techService.create({
            name: formData.techNames[i].trim(),
            category: formData.techCategories[i] || 'tool'
          });
          technologyIds.push(tech.id);
        }
      }

      const updateDto: UpdateProjectDto = {
        title: formData.title,
        description: formData.description,
        githubLink: formData.githubLink,
        demoLink: formData.demoLink,
        technologyIds
      };

      await this.projectService.update(id, updateDto);

      res.redirect(`/projects/view/${id}`);
    } catch (error) {
      console.error('Error updating project:', error);
      res.redirect(`/projects/edit/${id}?error=Не удалось обновить проект`);
    }
  }
}