import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { mapUserToModel, UserModel } from './dto/models/user.model';
import { NotificationsService } from '../notifications/notifications.service';
import {
  CreateUserInput,
  mapCreateUserInputToDto,
} from './dto/create-user.input';
import { CreateNotificationDto } from '../notifications/dto/create-notification.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import {
  mapUpdateUserInputToDto,
  UpdateUserInput,
} from './dto/update-user.input';
import { UserService } from './user.service';
import { UserPaginatedResponse } from './dto/repsponses/graphql/user-paginated.response';
import { mapPaginationInputToDto, PaginationInput } from 'src/common/dto/pagination.dto';

@Resolver()
export class UserResolver {
  constructor(
    private readonly usersService: UserService,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Mutation(() => UserModel)
  async create(@Args('data') data: CreateUserInput): Promise<UserModel> {
    const user = await this.usersService.create(mapCreateUserInputToDto(data));

    const notifyDto = new CreateNotificationDto();
    notifyDto.user_id = user.id;
    notifyDto.message = 'Добро пожаловать! Вы успешно создали профиль';
    await this.notificationsService.create(notifyDto);

    return mapUserToModel(user);
  }

  @Query(() => UserPaginatedResponse)
  async users(
    @Args('pagination', { nullable: true }) pagination: PaginationInput,
  ): Promise<UserPaginatedResponse> {
    const paginationDto = mapPaginationInputToDto(pagination);
    const result = await this.usersService.findAll(paginationDto);

    return {
      data: result.result.map(mapUserToModel),
      meta: result.meta,
    };
  }

  @Query(() => UserModel)
  async user(@Args('id') id: string): Promise<UserModel> {
    const result = await this.usersService.findOne(id);

    if (result === null) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    return mapUserToModel(result);
  }

  @Mutation(() => UserModel)
  async update(
    @Args('id') id: string,
    @Args('data') data: UpdateUserInput,
  ): Promise<UserModel> {
    const dto = mapUpdateUserInputToDto(data);
    const result = await this.usersService.update(id, dto);

    if (result === undefined) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    const notifyDto = new CreateNotificationDto();
    notifyDto.user_id = id;
    notifyDto.message = 'Вы успешно изменили данные профиля';
    await this.notificationsService.create(notifyDto);

    return mapUserToModel(result);
  }

  @Mutation(() => UserModel)
  async remove(@Args('id') id: string): Promise<UserModel> {
    const result = await this.usersService.remove(id);

    if (result === undefined) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    return mapUserToModel(result);
  }
}
