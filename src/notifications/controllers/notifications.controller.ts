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
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { NotificationsService } from '../notifications.service';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { UpdateNotificationDto } from '../dto/update-notification.dto';
import { Response, Request } from 'express';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateNotificationResponseDto } from '../dto/responses/create-notification-response.dto';
import { mapNotificationToDto, NotificationDto } from '../dto/notification.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { generateLinks } from 'src/common/utils/generate-links';
import { FindNotificationResponseDto } from '../dto/responses/find-notification-response.dto';
import { UpdateNotificationResponseDto } from '../dto/responses/update-notification-response.dto';
import { DeleteNotificationResponseDto } from '../dto/responses/delete-notification-response.dto';

@Controller('api/notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create notification',
    description: 'Create notification',
  })
  @ApiBody({ type: CreateNotificationDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Success',
    type: CreateNotificationResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error occurred',
  })
  async create(@Body() createNotificationDto: CreateNotificationDto) {
    const notification = await this.notificationsService.create(createNotificationDto);

    return {
      notification: mapNotificationToDto(notification)
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Find notifications',
    description: 'Find notifications',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: PaginatedResponseDto<NotificationDto>,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error occurred',
  })
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<PaginatedResponseDto<NotificationDto>> {
    const result = await this.notificationsService.findAll(paginationDto);
    const links = generateLinks(req, result.meta);

    res.setHeader('Link', links.join(', '));

    return {
      data: result.result.map(mapNotificationToDto),
      meta: result.meta,
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Find notification',
    description: 'Find notification',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: FindNotificationResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error occurred',
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<FindNotificationResponseDto> {
    const result = await this.notificationsService.findOne(id);

    if (!result) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    return {
      notification: mapNotificationToDto(result),
    };
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update notification',
    description: 'Update notification',
  })
  @ApiBody({ type: UpdateNotificationDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: UpdateNotificationResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error occurred',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ): Promise<UpdateNotificationResponseDto> {
    const result = await this.notificationsService.update(
      id,
      updateNotificationDto,
    );

    if (!result) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    return {
      notification: mapNotificationToDto(result),
    };
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete notification',
    description: 'Delete notification',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: DeleteNotificationResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error occurred',
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DeleteNotificationResponseDto> {
    const result = await this.notificationsService.remove(id);

    if (!result) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    return {
      notification: mapNotificationToDto(result),
    };
  }
}
