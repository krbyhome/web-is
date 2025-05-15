import { ApiProperty } from '@nestjs/swagger';
import { Project } from '../entities/project.entity';

export const mapProjectToDto = (project: Project): ProjectResponseDto => ({
  id: project.id,
  title: project.title,
  description: project.description,
  views: project.views,
  githubLink: project.githubLink,
  demoLink: project.demoLink,
  author: {
    name: project.author.name,
  },
  technologies: project.technologies.map(tech => ({
    name: tech.name,
  })),
});

export class ProjectResponseDto {
  @ApiProperty({ 
    example: 'a178acac-db03-4a67-a33b-31caaa4e590d', 
    description: 'Project ID (UUID)' 
  })
  id: string;

  @ApiProperty({ 
    example: 'My Awesome Project', 
    description: 'Project title' 
  })
  title: string;

  @ApiProperty({ 
    example: 'This project does amazing things', 
    description: 'Project description' 
  })
  description: string;

  @ApiProperty({ 
    example: 42, 
    description: 'Number of views',
    default: 0 
  })
  views: number;

  @ApiProperty({ 
    example: 'https://github.com/user/project', 
    description: 'GitHub repository link',
    required: false 
  })
  githubLink?: string;

  @ApiProperty({ 
    example: 'https://project-demo.com', 
    description: 'Live demo link',
    required: false 
  })
  demoLink?: string;

  @ApiProperty({
    type: Object,
    example: { name: 'Egor' },
    description: 'Project author'
  })
  author: {
    name: string;
  };

  @ApiProperty({
    type: Array,
    example: [{ name: 'TypeScript' }, { name: 'NestJS' }],
    description: 'List of technologies used in the project'
  })
  technologies: {
    name: string;
  }[];
}

export class ProjectListResponseDto {
  @ApiProperty({ type: [ProjectResponseDto] })
  data: ProjectResponseDto[];
}