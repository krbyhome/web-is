import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { mapCommentToModel, CommentModel } from './dto/models/comment.model';
import { mapPaginationInputToDto, PaginationInput } from '../common/dto/pagination.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentInput, mapCreateCommentInputToDto } from './dto/create-comment.input';
import { CommentPaginatedResponse } from './dto/comment-paginated.response';
import { mapUpdateCommentInputToDto, UpdateCommentInput } from './dto/update-comment.input';

@Resolver(() => CommentModel)
export class CommentsResolver {
  constructor(private readonly commentsService: CommentService) {}

  @Mutation(() => CommentModel)
  async createComment(
    @Args('data') data: CreateCommentInput,
  ): Promise<CommentModel> {
    const dto = mapCreateCommentInputToDto(data);
    console.log(dto);
    const comment = await this.commentsService.create(dto, data.userId);
    console.log(comment);
    return mapCommentToModel(comment);
  }

  @Query(() => [CommentModel])
  async projectComments(
    @Args('projectId') projectId: string
  ) {
    const result = await this.commentsService.findByProjectId(projectId);

    return result.map(mapCommentToModel);
  }

  @Query(() => CommentModel)
  async comment(@Args('id') id: number): Promise<CommentModel> {
    const result = await this.commentsService.findOne(id);

    if (!result) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }

    return mapCommentToModel(result);
  }

  @Mutation(() => CommentModel)
  async updateComment(
    @Args('id') id: number,
    @Args('data') data: UpdateCommentInput,
    @Args('userId') userId: string,
  ): Promise<CommentModel> {
    const dto = mapUpdateCommentInputToDto(data);
    const result = await this.commentsService.update(id, dto, userId);

    if (!result) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }

    return mapCommentToModel(result);
  }

  @Mutation(() => CommentModel)
  async removeComment(@Args('id') id: number, @Args('userId') userId: string): Promise<CommentModel> {
    const result = await this.commentsService.remove(id, userId);

    if (!result) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }

    return mapCommentToModel(result);
  }
}