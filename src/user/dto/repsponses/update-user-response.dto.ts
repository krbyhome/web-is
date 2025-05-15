import { UserDto } from '../user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserResponseDto {
  @ApiProperty()
  user: UserDto;
}
