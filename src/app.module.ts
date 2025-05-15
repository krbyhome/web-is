import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './infrastructure/database/connection.service';
import { AuthMiddleware } from './middleware/auth.middleware';
import { UserModule } from './user/user.module';
import { CommentModule } from './interactions/comment.module';
import { NotificationsModule } from './notifications/notifications.module';
import { TechnologyModule } from './content/technology.module';
import { ProjectModule } from './content/project.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
    }),
    UserModule,
    CommentModule,
    NotificationsModule,
    TechnologyModule,
    ProjectModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
