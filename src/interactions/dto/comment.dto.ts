import { ApiProperty } from '@nestjs/swagger';
import { Comment } from '../entities/comment.entity';

export const mapCommentToDto = (comment: Comment): CommentDto => ({
  id: comment.id,
  content: comment.content,
  author: {
    name: comment.author.name,
  },
  projectId: comment.project.id,
});

export class CommentDto {
  @ApiProperty({ example: 1, description: 'Comment ID' })
  id: number;

  @ApiProperty({ example: 'Great project!', description: 'Comment content' })
  content: string;

  @ApiProperty({
    type: Object,
    example: { name: 'Egor' },
    description: 'Comment author'
  })
  author: {
    name: string;
  };

  @ApiProperty({
    example: '0b2bef9a-9bf2-4948-8768-7d35538d3c68',
    description: 'Project ID'
  })
  projectId: string;
}