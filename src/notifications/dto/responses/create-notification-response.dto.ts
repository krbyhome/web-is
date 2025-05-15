import { ApiProperty } from '@nestjs/swagger';
import { NotificationDto } from '../notification.dto';

export class CreateNotificationResponseDto {
  @ApiProperty()
  notification: NotificationDto;
}
