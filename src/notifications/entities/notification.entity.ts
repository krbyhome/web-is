import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: string;

  @Column()
  message: string;

  @Column({ default: false })
  is_read: boolean;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: string;
}
