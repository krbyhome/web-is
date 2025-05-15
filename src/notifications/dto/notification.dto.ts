import { IsUUID } from 'class-validator';
import { Notification } from '../entities/notification.entity';
import { ApiProperty } from '@nestjs/swagger';

export class NotificationDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  @IsUUID()
  user_id: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  is_read: boolean;

  @ApiProperty()
  created_at: string;
}

export const mapNotificationToDto = (
  notification: Notification,
): NotificationDto => {
  return {
    id: notification.id,
    user_id: notification.user_id,
    message: notification.message,
    is_read: notification.is_read,
    created_at: notification.created_at,
  };
};
