import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { UserModule } from '../user/user.module';
import { CommentService } from './comment.service';
import { CommentController } from './controllers/comment.controller';
import { ProjectModule } from 'src/content/project.module';
import { Project } from 'src/content/entities/project.entity';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { CommentMvcController } from './controllers/comment-mvc.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, Project]),
    UserModule,
    NotificationsModule
  ],
  providers: [CommentService],
  controllers: [CommentController, CommentMvcController],
  exports: [CommentService],
})
export class CommentModule { }