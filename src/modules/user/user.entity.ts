import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  BeforeInsert,
  Repository,
} from 'typeorm';
import { Verification } from '../verification/verification.entity';
import { Buffer } from 'buffer';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt'; // 비밀번호 암호화

@Entity()
export class User {
  @PrimaryColumn({ type: 'binary', length: 16 })
  userId: Buffer;

  @Column({ unique: true })
  account: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToMany(() => Verification, (verification) => verification.user)
  verifications: Verification[];

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 비밀번호 암호화
  @BeforeInsert()
  private async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
