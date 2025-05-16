import { ObjectType } from '@nestjs/graphql';
import { PaginatedResponse } from 'src/common/utils/pagintated-response.factory';
import { CommentModel } from './models/comment.model';

@ObjectType()
export class CommentPaginatedResponse extends PaginatedResponse(
  CommentModel,
) {}
