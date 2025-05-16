import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../entities/user.entity';

@ObjectType({ description: 'User' })
export class UserModel {
  @Field(() => String)
  id: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  email: string;

  @Field(() => String, { nullable: true })
  avatar_url: string;
}

export const mapUserToModel = (user: User): UserModel => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar_url: user.avatar_url,
  };
};
