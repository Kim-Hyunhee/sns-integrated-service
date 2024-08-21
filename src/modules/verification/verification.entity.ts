import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Verification {
  @PrimaryGeneratedColumn()
  verificationId: number;

  @Column()
  verificationCode: string;

  @Column({ type: 'timestamp' })
  expiredAt: Date;

  @Column({ default: false })
  isConfirmed: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.verifications)
  user: User;
}
