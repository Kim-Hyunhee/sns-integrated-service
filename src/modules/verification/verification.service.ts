import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SendCodeDto } from './dto/sendCode.dto';
import { User } from '../user/user.entity';
import { Verification } from './verification.entity';

@Injectable()
export class VerificationService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Verification)
    private verificationRepository: Repository<Verification>,
  ) {}

  async sendCode(sendCodeDto: SendCodeDto) {
    const { email } = sendCodeDto;

    // 이메일이 유효한지 확인
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('해당 유저가 존재하지 않습니다.'); // 401 상태코드
    }

    // 인증 코드 생성
    const verificationCode = Math.random().toString(36).substring(2, 8);

    // 현재 시간과 만료 시간 설정
    const createdAt = new Date();
    const expiredAt = new Date(createdAt.getTime() + 30 * 60 * 1000); // 30분 후 만료

    // 기존에 Verification 데이터가 있는지 확인
    let verification = await this.verificationRepository.findOne({
      where: { user: user },
    });

    if (verification) {
      // Verification 데이터가 있으면 업데이트
      verification.verificationCode = verificationCode;
      verification.expiredAt = expiredAt;
      verification.createdAt = createdAt;
    } else {
      // Verification 데이터가 없으면 새로 생성
      verification = this.verificationRepository.create({
        user: user, // userId 대신 User객체 참조 -> 객체 지향적 방식
        verificationCode: verificationCode,
        expiredAt: expiredAt,
        createdAt: createdAt,
      });
    }

    // Verification 데이터 저장
    await this.verificationRepository.save(verification);

    // 이메일로 인증 코드를 전송하는 로직 (콘솔에 출력)
    console.log(`Verification code sent to ${email}: ${verificationCode}`);

    return {
      verificationCode,
    };
  }
}
