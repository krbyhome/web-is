import { Controller, Post, Get, Param, Render, Req, Res, UseFilters, Body } from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomSession } from '../../middleware/auth.middleware';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { CommentService } from '../comment.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { CreateNotificationDto } from 'src/notifications/dto/create-notification.dto';

@Controller('comments')
export class CommentMvcController {
  constructor(
    private readonly commentService: CommentService,
    private readonly notificationService: NotificationsService
  ) { }

  @Post(':projectId')
  async createComment(
    @Param('projectId') projectId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: Request & { session: CustomSession },
    @Res() res: Response
  ) {
    if (!req.session.userId) {
      return res.redirect('/login');
    }

    try {
      await this.commentService.create({
        ...createCommentDto,
        projectId,
      }, req.session.userId);

      const notifyDto = new CreateNotificationDto();
      notifyDto.user_id = req.session.userId;
      notifyDto.message = `Ты оставил комментарий на проект ${projectId}`;
      await this.notificationService.create(notifyDto);
    } catch (error) {
      const notifyDto = new CreateNotificationDto();
      notifyDto.user_id = req.session.userId;
      notifyDto.message = `При добавлении комментария произошла ошибка`;
      await this.notificationService.create(notifyDto);
    }

    return res.redirect(`/projects/view/${projectId}`);
  }

  @Get(':projectId')
  async getProjectComments(
    @Param('projectId') projectId: string,
    @Req() req: Request & { session: CustomSession }
  ) {
    const comments = await this.commentService.findByProjectId(projectId);
    return {
      comments,
      isAuthenticated: !!req.session.userId,
      currentUserId: req.session.userId,
      projectId,
      styles: ['comments.css'],
      layout: 'layouts/main',
    };
  }
}