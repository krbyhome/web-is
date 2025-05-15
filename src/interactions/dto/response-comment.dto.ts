import { ApiProperty } from '@nestjs/swagger';
import { CommentDto } from './comment.dto';

export class CommentResponseDto {
  @ApiProperty({ type: CommentDto })
  comment: CommentDto;
}

export class CommentListResponseDto {
  @ApiProperty({ type: [CommentDto] })
  data: CommentDto[];
}