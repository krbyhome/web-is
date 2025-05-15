import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional, IsUrl, IsNumber } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'My Awesome Project' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'This project does amazing things' })
  @IsString()
  description: string;

  @IsUrl()
  @IsOptional()
  @ApiProperty({ example: 'https://github.com/my-awesome-project' })
  githubLink?: string;

  @IsUrl()
  @IsOptional()
  @ApiProperty({ example: 'https://my-awesome-project.com' })
  demoLink?: string;

  @IsArray()
  @IsOptional()
  @ApiProperty({ example: [1, 2, 3] })
  technologyIds?: number[];
}