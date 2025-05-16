import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID, MaxLength } from 'class-validator';
import { CreateCommentDto } from '../dto/create-comment.dto';

@InputType({ description: 'Input for creating a new comment' })
export class CreateCommentInput {
    @Field(() => String, { description: 'User ID of the comment author' })
    @IsNotEmpty()
    userId: string;

    @Field(() => String, { description: 'Project ID where comment will be added' })
    @IsNotEmpty()
    @IsUUID()
    projectId: string;

    @Field(() => String, { description: 'Comment content text' })
    @IsNotEmpty()
    @MaxLength(2000, { message: 'Comment cannot be longer than 2000 characters' })
    content: string;
}

export const mapCreateCommentInputToDto = (
  input: CreateCommentInput,
): CreateCommentDto => ({
  projectId: input.projectId,
  content: input.content,
});