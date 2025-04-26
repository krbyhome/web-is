import { Entity, Column, OneToMany, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { UserProfile } from './profile.entity';
import { AuthSession } from './session.entity';
import { Project } from 'src/content/entities/project.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ type: 'enum', enum: ['ADMIN', 'AUTHOR', 'READER'] })
  role: string;

  @OneToOne(() => UserProfile, (profile) => profile.user)
  @JoinColumn()
  profile: UserProfile;

  @OneToMany(() => AuthSession, (session) => session.user)
  sessions: AuthSession[];

  @OneToMany(() => Project, (project) => project.author)
  authoredProjects: Project[];
}