import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Project } from './project.entity';

@Entity()
export class Technology {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ['frontend', 'backend', 'tool', 'database'],
    default: 'tool'
  })
  category: string;

  @Column({ nullable: true })
  iconUrl: string;

  @ManyToMany(() => Project, project => project.technologies)
  projects: Project[];
}