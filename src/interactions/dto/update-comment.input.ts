import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID, IsOptional, MaxLength } from 'class-validator';
import { UpdateCommentDto } from '../dto/update-comment.dto';

@InputType({ description: 'Input for updating a comment' })
export class UpdateCommentInput {
  @Field(() => String, { description: 'ID of the comment to update' })
  @IsNotEmpty()
  @IsUUID()
  commentId: string;

  @Field(() => String, { 
    description: 'Updated comment content', 
    nullable: true 
  })
  @IsOptional()
  @MaxLength(2000, { message: 'Comment cannot be longer than 2000 characters' })
  content: string;
}

export const mapUpdateCommentInputToDto = (
  input: UpdateCommentInput,
): UpdateCommentDto => ({
    content: input.content,
});