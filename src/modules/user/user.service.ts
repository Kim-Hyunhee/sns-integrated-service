import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Register } from '@app/auth/dto/auth.dto';
import { uuidv7 } from 'uuidv7';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async register(register: Register) {
    const { email, account, password } = register; // 올바른 이메일 구조인지 검증

    // 계정이 고유한지 확인
    const hasAccount = await this.userRepository.findOne({
      where: { account },
    });
    if (hasAccount) {
      throw new HttpException(
        { success: false, error: '사용 중인 계정입니다.' },
        HttpStatus.BAD_REQUEST,
      );
    }

    // 비밀번호 제약 조건
    // 1. 숫자, 문자, 특수 문자 중 2가지 이상을 포함해야 합니다.
    const condition1 = new RegExp(
      /^(?=(.*[a-zA-Z])(?=.*\d)|(?=.*[a-zA-Z])(?=.*[!@#$%^&*\(\)_\+\-=\[\]\{\};\':\"\\|,.<>\/\?])|(?=.*\d)(?=.*[!@#$%^&*\(\)_\+\-=\[\]\{\};\':\"\\|,.<>\/\?]))/,
    );
    // 2. 3회 이상 연속되는 문자 사용이 불가합니다.
    const condition2 = new RegExp(/^(?!.*(.)\1{2,})/);

    const passCondition1 = condition1.test(password);
    if (!passCondition1) {
      throw new HttpException(
        {
          success: false,
          error:
            '비밀번호는 숫자, 문자, 특수 문자 중 2가지 이상을 포함해야 합니다.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const passCondition2 = condition2.test(password);
    if (!passCondition2) {
      throw new HttpException(
        {
          success: false,
          error: '비밀번호에는 3회 이상 연속되는 문자 사용이 불가합니다.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // 현재 시간
    const createdAt = new Date();

    const uuidString = uuidv7(); // uuidv7
    const userId = Buffer.from(uuidString, 'hex');

    // 사용자 데이터 추가
    const newUser = this.userRepository.create({
      account: account,
      userId: userId,
      email: email,
      password: password,
      createdAt: createdAt,
      updatedAt: createdAt,
    });
    await this.userRepository.save(newUser);

    console.log(`회원가입 완료 (계정: ${account})`);

    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: '회원가입이 완료되었습니다.',
    };
  }
}
