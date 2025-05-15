import { ApiProperty } from "@nestjs/swagger";

export class CreateNotificationDto {
  @ApiProperty({example: 'd952e1b5-6e93-47df-ab1e-a39ef25477fa'})
  user_id: string;
  @ApiProperty({example: 'Hello, world!'})
  message: string;
}
