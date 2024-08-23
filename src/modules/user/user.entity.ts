import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  BeforeInsert,
  Repository,
} from 'typeorm';
import { Verification } from '../verification/verification.entity';
import { uuidv7 } from 'uuidv7';
import { Buffer } from 'buffer';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';

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

  @BeforeInsert()
  async generateId() {
    let unique = false;

    while (!unique) {
      const uuidString = uuidv7();
      const uuidBuffer = Buffer.from(uuidString.replace(/-/g, ''), 'hex');

      const existingUser = await this.userRepository.findOne({
        where: { userId: uuidBuffer },
      });

      if (!existingUser) {
        this.userId = uuidBuffer;
        unique = true;
      }
    }
  }

  // 비밀번호 암호화
  private async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
