import { UserDto } from '../user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class FindUserResponseDto {
  @ApiProperty()
  user: UserDto;
}
