import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Project } from './project.entity';

@Entity()
export class Technology {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  iconUrl: string;

  @Column({ unique: true })
  name: string;

  @Column()
  category: 'frontend' | 'backend' | 'tool';

  @ManyToMany(() => Project)
  projects: Project[];
}