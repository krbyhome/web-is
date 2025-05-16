import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUrl, MaxLength, IsOptional, IsUUID, IsArray } from 'class-validator';
import { UpdateProjectDto } from '../dto/update-project.dto';

@InputType({ description: 'Input for updating a project' })
export class UpdateProjectInput {
  @Field(() => String, { description: 'Project ID to update' })
  @IsNotEmpty()
  @IsUUID()
  projectId: string;

  @Field(() => String, { 
    description: 'Project title', 
    nullable: true 
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Title cannot be longer than 100 characters' })
  title?: string;

  @Field(() => String, { 
    description: 'Project description',
    nullable: true 
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: 'Description cannot be longer than 2000 characters' })
  description?: string;

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
    nullable: true 
  })
  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  technologyIds?: number[];
}

export const mapUpdateProjectInputToDto = (
  input: UpdateProjectInput,
): UpdateProjectDto => ({
    title: input.title,
    description: input.description,
    githubLink: input.githubLink,
    demoLink: input.demoLink,
    technologyIds: input.technologyIds,
});