import { Controller, Get, Render, Req } from '@nestjs/common';
import { NotificationsService } from '../notifications.service';
import { UpdateNotificationDto } from '../dto/update-notification.dto';
import { CustomSession } from 'src/middleware/auth.middleware';

@Controller('notifications')
export class NotificationsMvcController {
  constructor(private readonly notificationsService: NotificationsService) { }

  @Get()
  @Render('pages/notifications/notifications')
  async view(@Req() req: Request & { session: CustomSession }) {
    if (!req.session.userId) {
      return {
        notifications: null,
        styles: ['notifications.css'],
        layout: 'layouts/main',
      };
    }

    const notifications = await this.notificationsService.findByUserId(
      req.session.userId,
    );

    for (const notification of notifications) {
      const dto = new UpdateNotificationDto();
      dto.is_read = true;
      this.notificationsService.update(notification.id, dto);
    }

    return {
      notifications: notifications,
      styles: ['notifications.css'],
      layout: 'layouts/main',
    };
  }
}
