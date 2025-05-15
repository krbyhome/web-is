import { User } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  avatar_url: string;
}

export const mapUserToDto = (user: User): UserDto => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar_url: user.avatar_url,
  };
};
