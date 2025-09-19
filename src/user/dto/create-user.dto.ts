import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({example: 'https://i.pinimg.com/736x/e0/26/ee/e026eeff9f410567a95fab2360af5338.jpg'})
  @IsNotEmpty()
  avatar_url: string;
}
