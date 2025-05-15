import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, Length } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    example: 'AMAZING PROJECT!',
    description: 'Comment content',
    minLength: 1,
    maxLength: 1000
  })
  @IsString()
  @Length(1, 1000)
  content: string;

  @ApiProperty({
    example: '0b2bef9a-9bf2-4948-8768-7d35538d3c68',
    description: 'Project ID',
  })
  @IsUUID()
  projectId: string;
}