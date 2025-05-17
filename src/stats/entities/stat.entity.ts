import { Entity, Column, PrimaryColumn } from 'typeorm';


@Entity()
export class Stat {
  @PrimaryColumn()
  id: string;

  @Column({ default: 0 })
  views: number;
}