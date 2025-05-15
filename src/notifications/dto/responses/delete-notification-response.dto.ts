import { NotificationDto } from '../notification.dto';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteNotificationResponseDto {
  @ApiProperty()
  notification: NotificationDto;
}
