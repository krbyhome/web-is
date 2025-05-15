import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './controllers/notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationsMvcController } from './controllers/notifications-mvc.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  controllers: [NotificationsController, NotificationsMvcController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
