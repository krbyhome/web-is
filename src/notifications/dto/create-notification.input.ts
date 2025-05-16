import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { CreateNotificationDto } from './create-notification.dto';

@InputType()
export class CreateNotificationInput {
  @Field(() => String)
  @IsNotEmpty()
  user_id: string;

  @Field(() => String)
  @IsNotEmpty()
  message: string;
}

export const mapCreateNotificationInputToDto = (
  input: CreateNotificationInput,
): CreateNotificationDto => {
  return {
    user_id: input.user_id,
    message: input.message,
  };
};
