import { IsEmail, IsNotEmpty } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { CreateUserDto } from './create-user.dto';

@InputType()
export class CreateUserInput {
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

export const mapCreateUserInputToDto = (
  input: CreateUserInput,
): CreateUserDto => {
  return {
    name: input.name,
    email: input.email,
    avatar_url: input.avatar_url,
  };
};
