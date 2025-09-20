import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { ProjectService } from './project.service';
import { UserModule } from '../user/user.module';
import { TechnologyModule } from './technology.module';
import { ProjectController } from './controllers/project.controller';
import { Technology } from './entities/technology.entity';
import { Notification } from 'src/notifications/entities/notification.entity';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { ProjectMvcController } from './controllers/project-mvc.controller';
import { Comment } from 'src/interactions/entities/comment.entity';
import { CommentModule } from 'src/interactions/comment.module';
import { ProjectsResolver } from './project.resolver';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, Technology, Notification, Comment]),
    UserModule,
    CommentModule,
    TechnologyModule,
    NotificationsModule,
    CacheModule.register({
      ttl: 5
    }),
  ],
  providers: [ProjectService, ProjectsResolver],
  controllers: [ProjectController, ProjectMvcController],
  exports: [ProjectService],
})
export class ProjectModule { }