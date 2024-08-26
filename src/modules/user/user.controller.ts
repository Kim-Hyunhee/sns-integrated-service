import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserGuard } from './user.guard';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 사용자 회원가입
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
  async register(@Body() register: RegisterDto) {
    return this.userService.register(register);
  }

  // 사용자 로그인
  @Post('/login')
  @ApiResponse({ status: 200, description: '로그인되었습니다.' })
  @ApiResponse({
    status: 404,
    description: '가입되지 않은 계정입니다.',
  })
  @ApiResponse({
    status: 401,
    description: '비밀번호가 틀렸습니다.',
  })
  async login(@Body() login: LoginDto) {
    return this.userService.login(login);
  }

  // 로그인한 사용자 프로필 가져오기
  @Get('profile')
  @UseGuards(UserGuard)
  @ApiBearerAuth()
  getProfile(@Request() req) {
    return req.user;
  }
}
