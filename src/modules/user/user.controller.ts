import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Register } from '@app/auth/dto/auth.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  @ApiResponse({ status: 200, description: '회원 가입되었습니다' })
  @ApiResponse({
    status: 400,
    description: '이미 사용 중인 계정/비밀번호 조건 위반/잘못된 이메일 구조',
  })
  @UsePipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const errorMessages = errors.map((error) => {
          if (error.property === 'email') {
            return '이메일 구조가 올바르지 않습니다.';
          }
          return Object.values(error.constraints).join(', ');
        });
        return new BadRequestException({
          success: false,
          statusCode: 400,
          error: errorMessages,
        });
      },
    }),
  )
  async register(@Body() register: Register) {
    return this.userService.register(register);
  }
}

//@Post('/login')
