import { IsEmail, IsNotEmpty } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { UpdateUserDto } from './update-user.dto';

@InputType()
export class UpdateUserInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  avatar_url: string;
}

export const mapUpdateUserInputToDto = (
  input: UpdateUserInput,
): UpdateUserDto => {
  return {
    name: input.name,
    email: input.email,
    avatar_url: input.avatar_url,
  };
};
