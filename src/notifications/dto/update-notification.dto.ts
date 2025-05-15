import { PartialType } from '@nestjs/mapped-types';
import { CreateNotificationDto } from './create-notification.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {
  @ApiProperty()
  is_read: boolean;
}
