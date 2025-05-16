import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Project } from 'src/content/entities/project.entity';
import { UserModel } from 'src/user/dto/models/user.model';
import { TechnologyModel } from './technology.model';

@ObjectType({ description: 'Project' })
export class ProjectModel {
  @Field(() => String)
  id: string;

  @Field({ nullable: true})
  title: string;

  @Field({ nullable: true})
  description: string;

  @Field(() => Int, { nullable: true})
  views: number;

  @Field({ nullable: true })
  githubLink?: string;

  @Field({ nullable: true })
  demoLink?: string;

  @Field(() => UserModel, { nullable: true})
  author: UserModel;

  @Field(() => [TechnologyModel], { nullable: true})
  technologies: TechnologyModel[];
}

export const mapProjectToModel = (project: Project): ProjectModel => ({
  id: project.id,
  title: project.title,
  description: project.description,
  views: project.views,
  githubLink: project.githubLink,
  demoLink: project.demoLink,
  author: {
    id: project.author.id,
    name: project.author.name,
    email: project.author.email,
    avatar_url: project.author.avatar_url
  } as UserModel,
  technologies: project.technologies?.map(tech => ({
    id: tech.id,
    name: tech.name,
    category: tech.category,
    iconUrl: tech.iconUrl
  } as TechnologyModel)) || []
});