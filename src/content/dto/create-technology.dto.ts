import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUrl, IsOptional, IsEnum } from 'class-validator';

export class CreateTechnologyDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsEnum(['frontend', 'backend', 'tool', 'database'])
  @ApiProperty()
  category: string;

  @IsUrl()
  @IsOptional()
  @ApiPropertyOptional()
  iconUrl?: string;
}