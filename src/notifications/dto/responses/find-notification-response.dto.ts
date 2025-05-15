import { NotificationDto } from '../notification.dto';
import { ApiProperty } from '@nestjs/swagger';

export class FindNotificationResponseDto {
  @ApiProperty()
  notification: NotificationDto;
}
