import { ObjectType } from '@nestjs/graphql';
import { NotificationModel } from '../../models/notification.model';
import { PaginatedResponse } from 'src/common/utils/pagintated-response.factory';

@ObjectType()
export class NotificationPaginatedResponse extends PaginatedResponse(
  NotificationModel,
) {}
