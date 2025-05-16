import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Technology } from 'src/content/entities/technology.entity';

@ObjectType({ description: 'Technology stack item' })
export class TechnologyModel {
  @Field(() => Int, { description: 'Unique identifier' })
  id: number;

  @Field({ description: 'Technology name (e.g. TypeScript, React)' })
  name: string;

  @Field(() => String, { 
    description: 'Technology category',
    defaultValue: 'tool',
    deprecationReason: 'Consider using tags instead' 
  })
  category: 'frontend' | 'backend' | 'tool' | 'database';

  @Field({ 
    nullable: true, 
    description: 'URL to technology icon/logo' 
  })
  iconUrl?: string;
}

export const mapTechnologyToModel = (
  technology: Technology
): TechnologyModel => ({
  id: technology.id,
  name: technology.name,
  category: technology.category as 'frontend' | 'backend' | 'tool' | 'database',
  iconUrl: technology.iconUrl || undefined
});