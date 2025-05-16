import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUrl, MaxLength, IsOptional, IsInt } from 'class-validator';
import { UpdateTechnologyDto } from '../dto/update-technology.dto';

@InputType({ description: 'Input for updating a technology' })
export class UpdateTechnologyInput {
  @Field(() => Int, { description: 'Technology ID to update' })
  @IsNotEmpty()
  @IsInt()
  technologyId: number;

  @Field(() => String, { 
    description: 'Technology name',
    nullable: true 
  })
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Name cannot be longer than 50 characters' })
  name?: string;

  @Field(() => String, { 
    description: 'Technology category',
    nullable: true 
  })
  @IsOptional()
  @IsString()
  category?: 'frontend' | 'backend' | 'tool' | 'database';

  @Field(() => String, { 
    description: 'URL to technology icon/logo',
    nullable: true 
  })
  @IsOptional()
  @IsUrl()
  iconUrl?: string;
}

export const mapUpdateTechnologyInputToDto = (
  input: UpdateTechnologyInput,
): UpdateTechnologyDto => ({
    name: input.name,
    category: input.category,
    iconUrl: input.iconUrl,
});