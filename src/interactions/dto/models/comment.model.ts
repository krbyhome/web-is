import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Comment } from '../../entities/comment.entity';
import { UserModel } from 'src/user/dto/models/user.model';
import { ProjectModel } from 'src/content/dto/models/project.model';

@ObjectType({ description: 'Comment' })
export class CommentModel {
  @Field(() => Int)
  id: number;

  @Field(() => String, { nullable: true})
  content: string;

  @Field(() => UserModel, { nullable: true})
  author: UserModel;

  @Field(() => ProjectModel, { nullable: true})
  project: ProjectModel;
}

export const mapCommentToModel = (
  comment: Comment,
): CommentModel => ({
  id: comment.id,
  content: comment.content,
  author: {
    id: comment.author.id,
    name: comment.author.name,
    email: comment.author.email,
    avatar_url: comment.author.avatar_url
  } as UserModel,
  project: {
    id: comment.project.id,
    title: comment.project.title
  } as ProjectModel,
});