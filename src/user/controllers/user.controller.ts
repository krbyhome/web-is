import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseUUIDPipe,
  HttpException,
  HttpStatus,
  Req,
  Res,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from '../user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { CreateNotificationDto } from 'src/notifications/dto/create-notification.dto';
import { CustomSession } from 'src/middleware/auth.middleware';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserResponseDto } from '../dto/repsponses/create-user-response.dto';
import { mapUserToDto, UserDto } from '../dto/user.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { generateLinks } from 'src/common/utils/generate-links';
import { FindUserResponseDto } from '../dto/repsponses/find-user-response.dto';
import { UpdateUserResponseDto } from '../dto/repsponses/update-user-response.dto';
import { DeleteUserResponseDto } from '../dto/repsponses/delete-user-response.dto';
import { S3Service } from 'src/s3/s3.service';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Users')
@Controller('api/users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly notificationService: NotificationsService,
    private readonly s3Service: S3Service,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Create user', description: 'Create user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Success',
    type: CreateUserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error occurred',
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<CreateUserResponseDto> {
    const user = await this.userService.create(createUserDto);

    const notifyDto = new CreateNotificationDto();
    notifyDto.user_id = user.id;
    notifyDto.message = 'Привет! Ты успешно создал профиль';
    await this.notificationService.create(notifyDto);

    return {
      user: mapUserToDto(user),
    };
  }

  @Get()
  @ApiOperation({ summary: 'Find users', description: 'Find users' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: PaginatedResponseDto<UserDto>,
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
  ): Promise<PaginatedResponseDto<UserDto>> {
    const result = await this.userService.findAll(paginationDto);
    const links = generateLinks(req, result.meta);

    res.setHeader('Link', links.join(', '));

    return {
      data: result.result.map(mapUserToDto),
      meta: result.meta,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find user', description: 'Find user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: FindUserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error occurred',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<FindUserResponseDto> {
    const result = await this.userService.findOne(id);

    if (result === null) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    return {
      user: mapUserToDto(result)
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user', description: 'Update user' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        email: { type: 'string', format: 'email' },
        avatar: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: UpdateUserResponseDto,
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
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request & { session: CustomSession },
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() avatar?: Express.Multer.File,
  ): Promise<UpdateUserResponseDto> {
    try {
      if (avatar) {
        await this.s3Service.uploadFile(id, avatar);
      }

      const result = await this.userService.update(id, updateUserDto);

      if (!result) {
        throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
      }

      const notifyDto = new CreateNotificationDto();
      notifyDto.user_id = id;
      notifyDto.message = 'Ты успешно изменил данные профиля';
      await this.notificationService.create(notifyDto);

      req.session.username = result.name;

      return {
        user: mapUserToDto(result)
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to update user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user', description: 'Delete user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: DeleteUserResponseDto,
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
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await this.userService.remove(id);

    return {
      status: 200,
      code: "SUCCESS"
    }
  }
}