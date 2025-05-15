import { UserDto } from '../user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteUserResponseDto {
  @ApiProperty()
  user: UserDto;
}
