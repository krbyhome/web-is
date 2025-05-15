import { UserDto } from '../user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserResponseDto {
  @ApiProperty()
  user: UserDto;
}
