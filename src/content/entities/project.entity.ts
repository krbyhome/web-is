import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Technology } from './technology.entity';


@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ default: 0 })
  views: number;

  @ManyToOne(() => User)
  author: User;

  @ManyToMany(() => Technology)
  @JoinTable()
  technologies: Technology[];
}