import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { UpdateNotificationDto } from './update-notification.dto';

@InputType()
export class UpdateNotificationInput {
  @Field(() => String)
  @IsNotEmpty()
  user_id: string;

  @Field(() => String)
  @IsNotEmpty()
  message: string;

  @Field(() => Boolean)
  @IsNotEmpty()
  is_read: boolean;
}

export const mapUpdateNotificationInputToDto = (
  input: UpdateNotificationInput,
): UpdateNotificationDto => {
  return {
    user_id: input.user_id,
    message: input.message,
    is_read: input.is_read,
  };
};
