import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUrl, MaxLength, IsOptional } from 'class-validator';
import { CreateTechnologyDto } from '../dto/create-technology.dto';

@InputType({ description: 'Input for creating a new technology' })
export class CreateTechnologyInput {
  @Field(() => String, { description: 'Technology name (e.g. TypeScript, React)' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50, { message: 'Name cannot be longer than 50 characters' })
  name: string;

  @Field(() => String, { 
    description: 'Technology category',
    defaultValue: 'tool'
  })
  @IsNotEmpty()
  @IsString()
  category: 'frontend' | 'backend' | 'tool' | 'database';

  @Field(() => String, { 
    description: 'URL to technology icon/logo',
    nullable: true 
  })
  @IsOptional()
  @IsUrl()
  iconUrl?: string;
}

export const mapCreateTechnologyInputToDto = (
  input: CreateTechnologyInput,
): CreateTechnologyDto => ({
  name: input.name,
  category: input.category,
  ...(input.iconUrl && { iconUrl: input.iconUrl }),
});