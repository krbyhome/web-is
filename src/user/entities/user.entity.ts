import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Project } from 'src/content/entities/project.entity';
import { UserDto } from '../dto/user.dto';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  avatar_url: string;

  @Column({ unique: true })
  email: string;

  @OneToMany(() => Project, (project) => project.author)
  projects: Project[];
}