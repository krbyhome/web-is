import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUrl, MaxLength, IsOptional } from 'class-validator';
import { CreateProjectDto } from '../dto/create-project.dto';

@InputType({ description: 'Input for creating a new project' })
export class CreateProjectInput {
  @Field(() => String, { description: 'Project title' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100, { message: 'Title cannot be longer than 100 characters' })
  title: string;

  @Field(() => String, { description: 'Project description' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(2000, { message: 'Description cannot be longer than 2000 characters' })
  description: string;

  @Field(() => String, { 
    description: 'GitHub repository URL',
    nullable: true 
  })
  @IsOptional()
  @IsUrl()
  githubLink?: string;

  @Field(() => String, { 
    description: 'Live demo URL',
    nullable: true 
  })
  @IsOptional()
  @IsUrl()
  demoLink?: string;

  @Field(() => [String], { 
    description: 'Technology IDs associated with the project',
    defaultValue: [] 
  })
  @IsOptional()
  technologyIds?: number[];
}

export const mapCreateProjectInputToDto = (
  input: CreateProjectInput,
): CreateProjectDto => ({
  title: input.title,
  description: input.description,
  githubLink: input.githubLink,
  demoLink: input.demoLink,
  technologyIds: input.technologyIds,
});