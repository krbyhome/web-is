import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NotificationsService } from './notifications.service';
import {
  mapNotificationToModel,
  NotificationModel,
} from './dto/models/notification.model';
import {
  CreateNotificationInput,
  mapCreateNotificationInputToDto,
} from './dto/create-notification.input';
import { NotificationPaginatedResponse } from './dto/responses/graphql/notification-paginated.response';
import {
  mapPaginationInputToDto,
  PaginationInput,
} from '../common/dto/pagination.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import {
  mapUpdateNotificationInputToDto,
  UpdateNotificationInput,
} from './dto/update-notification.input';
import { GraphQLError } from 'graphql';

@Resolver()
export class NotificationsResolver {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Mutation(() => NotificationModel)
  async createNotification(
    @Args('data') data: CreateNotificationInput,
  ): Promise<NotificationModel> {
    try {
      const dto = mapCreateNotificationInputToDto(data);
      const notification = await this.notificationsService.create(dto);

      return mapNotificationToModel(notification);
    } catch (error) {
      throw new GraphQLError(error.message, {
        extensions: {
          code: error.status,
          status: error.status,
        },
      });
    }
  }

  @Query(() => NotificationPaginatedResponse)
  async notifications(
    @Args('pagination', { nullable: true }) pagination: PaginationInput,
  ): Promise<NotificationPaginatedResponse> {
    try {
      const dto = mapPaginationInputToDto(pagination);
      const result = await this.notificationsService.findAll(dto);
      return {
        data: result.result.map(mapNotificationToModel),
        meta: result.meta,
      };
    } catch (error) {
      throw new GraphQLError(error.message, {
        extensions: {
          code: error.status,
          status: error.status,
        },
      });
    }
  }

  @Query(() => NotificationModel)
  async notification(@Args('id') id: number): Promise<NotificationModel> {
    try {
      const result = await this.notificationsService.findOne(id);
      if (!result) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }
      return mapNotificationToModel(result);
    } catch (error) {
      throw new GraphQLError(error.message, {
        extensions: {
          code: error.status,
          status: error.status,
        },
      });
    }
  }

  @Mutation(() => NotificationModel)
  async updateNotification(
    @Args('id') id: number,
    @Args('data') data: UpdateNotificationInput,
  ): Promise<NotificationModel> {
    try {
      const dto = mapUpdateNotificationInputToDto(data);
      const result = await this.notificationsService.update(id, dto);

      if (!result) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }

      return mapNotificationToModel(result);
   } catch (error) {
      throw new GraphQLError(error.message, {
        extensions: {
          code: error.status,
          status: error.status,
        },
      });
    }
  }

  @Mutation(() => NotificationModel)
  async removeNotification(@Args('id') id: number): Promise<NotificationModel> {
    try {
      const result = await this.notificationsService.remove(id);

      if (!result) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }

      return mapNotificationToModel(result);
    } catch (error) {
      throw new GraphQLError(error.message, {
        extensions: {
          code: error.status,
          status: error.status,
        },
      });
    }
  }
}
