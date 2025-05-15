import { ApiProperty } from '@nestjs/swagger';
import { Technology } from '../entities/technology.entity';

export const mapTechnologyToDto = (technology: Technology): TechnologyResponseDto => ({
  id: technology.id,
  name: technology.name,
  category: technology.category,
  iconUrl: technology.iconUrl,
});

export class TechnologyResponseDto {
  @ApiProperty({ 
    example: 1, 
    description: 'Technology ID' 
  })
  id: number;

  @ApiProperty({ 
    example: 'TypeScript', 
    description: 'Technology name' 
  })
  name: string;

  @ApiProperty({
    enum: ['frontend', 'backend', 'tool', 'database'],
    example: 'frontend',
    description: 'Technology category'
  })
  category: string;

  @ApiProperty({ 
    example: 'https://example.com/icons/typescript.png', 
    description: 'Technology icon URL',
    required: false 
  })
  iconUrl?: string;
}

export class TechnologyListResponseDto {
  @ApiProperty({ 
    type: [TechnologyResponseDto],
    description: 'Array of technologies' 
  })
  data: TechnologyResponseDto[];
}