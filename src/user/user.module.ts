import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './controllers/user.controller';
import { UserMvcController } from './controllers/user-mvc.controller';
import { Notification } from 'src/notifications/entities/notification.entity';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Notification]),
    NotificationsModule
  ],
  controllers: [UserController, UserMvcController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
