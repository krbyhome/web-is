import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Notification } from '../../entities/notification.entity';

@ObjectType({ description: 'Notification' })
export class NotificationModel {
  @Field(() => Int)
  id: number;

  @Field(() => String, { nullable: true})
  user_id: string;

  @Field(() => String, { nullable: true})
  message: string;

  @Field(() => Boolean, { nullable: true})
  is_read: boolean;
}

export const mapNotificationToModel = (
  notification: Notification,
): NotificationModel => {
  return {
    id: notification.id,
    user_id: notification.user_id,
    message: notification.message,
    is_read: notification.is_read,
  };
};
