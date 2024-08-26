import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerificationService } from './verification.service';
import { VerificationController } from './verification.controller';
import { Verification } from './verification.entity';
import { UserModule } from '../user/user.module'; // UsersModule 임포트

@Module({
  imports: [
    TypeOrmModule.forFeature([Verification]),
    UserModule, // UserRepository를 사용하기 위해 UsersModule 임포트
  ],
  controllers: [VerificationController],
  providers: [VerificationService],
})
export class VerificationModule {}
