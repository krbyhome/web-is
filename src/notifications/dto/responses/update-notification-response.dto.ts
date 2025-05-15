import { NotificationDto } from '../notification.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateNotificationResponseDto {
  @ApiProperty()
  notification: NotificationDto;
}
