import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { CommentService } from '../comment.service';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { Request } from 'express';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiBearerAuth,
  ApiCookieAuth
} from '@nestjs/swagger';
import { CommentListResponseDto, CommentResponseDto } from '../dto/response-comment.dto';
import { CustomSession } from 'src/middleware/auth.middleware';
import { mapCommentToDto } from '../dto/comment.dto';


@ApiTags('Comments')
@ApiBearerAuth()
@ApiCookieAuth('session-id')
@Controller('api/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @Post()
  @ApiOperation({
    summary: 'Create comment',
    description: 'Creates a new comment for a project'
  })
  @ApiBody({
    type: CreateCommentDto,
    description: 'Comment creation data'
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Comment created successfully',
    type: CommentResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - User not logged in',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: Request & { session: CustomSession },
  ): Promise<CommentResponseDto> {
    if (!req.session.userId) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const comment = await this.commentService.create(createCommentDto, req.session.userId);
    comment.author.name = req.session.username!;

    return {
      comment: mapCommentToDto(comment)
    };
  }

  @Get('project/:projectId')
  @ApiOperation({
    summary: 'Get project comments',
    description: 'Returns all comments for specified project'
  })
  @ApiParam({
    name: 'projectId',
    type: String,
    description: 'Project UUID',
    example: '0b2bef9a-9bf2-4948-8768-7d35538d3c68'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Comments retrieved successfully',
    type: CommentListResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Project not found or has no comments',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async getByProject(
    @Param('projectId') projectId: string,
  ): Promise<CommentListResponseDto> {
    const comments = await this.commentService.findByProjectId(projectId);

    if (!comments) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    return {
      data: comments.map(mapCommentToDto),
    };
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update comment',
    description: 'Updates existing comment. Only comment author can update.'
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Comment ID',
    example: 1
  })
  @ApiBody({
    type: UpdateCommentDto,
    description: 'Comment update data'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Comment updated successfully',
    type: CommentResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - User not logged in',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - User is not comment author',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Comment not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req: Request & { session: CustomSession },
  ): Promise<CommentResponseDto> {
    if (!req.session.userId) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const comment = await this.commentService.update(id, updateCommentDto, req.session.userId);
    if (!comment || comment.author.id != req.session.userId) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    return {
      comment: mapCommentToDto(comment)
    };
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete comment',
    description: 'Deletes existing comment. Only comment author can delete.'
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Comment ID',
    example: 1
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Comment deleted successfully',
    type: CommentResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - User not logged in',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - User is not comment author',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Comment not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { session: CustomSession },
  ): Promise<CommentResponseDto> {
    if (!req.session.userId) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const comment = await this.commentService.remove(id, req.session.userId);
    if (!comment || comment.author.id != req.session.userId) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    return {
      comment: mapCommentToDto(comment)
    };
  }
}