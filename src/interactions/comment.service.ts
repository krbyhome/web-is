import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { Project } from 'src/content/entities/project.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) { }

  async create(
    createCommentDto: CreateCommentDto,
    authorId: string,
  ): Promise<Comment> {
    const project = await this.projectRepository.findOneBy({
      id: createCommentDto.projectId
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const comment = this.commentRepository.create({
      content: createCommentDto.content,
      author: { id: authorId },
      project,
    });

    return this.commentRepository.save(comment);
  }

  async findOne(id: number) {
    return this.commentRepository.findOne({
      where: { id },
      relations: ['author', 'project'],
    });
  }

  async findByProjectId(projectId: string): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { project: { id: projectId } },
      relations: ['author', 'project'],
      order: { id: 'DESC' },
    });
  }

  async update(
    id: number,
    updateCommentDto: UpdateCommentDto,
    currentUserId: string,
  ): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author', 'project'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.author.id !== currentUserId) {
      throw new ForbiddenException('You can only edit your own comments');
    }

    comment.content = updateCommentDto.content;
    return this.commentRepository.save(comment);
  }

  async remove(id: number, currentUserId: string) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author', 'project'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.author.id !== currentUserId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.commentRepository.remove(comment);

    return comment;
  }

  async getCountByProject(projectId: string): Promise<number> {
    return this.commentRepository.count({
      where: {
        project: { id: projectId }
      },
    });
  }
}