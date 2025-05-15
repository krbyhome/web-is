import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty({
    example: 'Updated comment text',
    description: 'New comment content',
    minLength: 1,
    maxLength: 1000,
    required: false
  })
  @IsString()
  @Length(1, 1000)
  content: string;
}