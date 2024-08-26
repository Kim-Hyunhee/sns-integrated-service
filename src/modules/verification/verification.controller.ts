import { Controller, Post, Body } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { SendCodeDto } from './dto/sendCode.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { VerifyCodeDto } from './dto/verify.dto';

@ApiTags('verification')
@Controller('verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Post('sendCode')
  @ApiOperation({ summary: 'Send verification code' })
  @ApiResponse({ status: 200, description: 'Transfer successful.' })
  @ApiResponse({ status: 400, description: 'Invalid email format.' })
  @ApiResponse({ status: 401, description: 'Invalid user.' })
  async sendCode(@Body() sendCodeDto: SendCodeDto) {
    // 이메일이 유효한지 확인, 자동으로 유효성 검사 실행
    return this.verificationService.sendCode(sendCodeDto); // 성공하면 200 상태코드
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify user status' })
  @ApiResponse({ status: 200, description: 'Transfer successful.' })
  @ApiResponse({ status: 410, description: 'Expired verification code.' })
  @ApiResponse({ status: 400, description: 'Invalid verification code.' })
  async verifyCode(@Body() verifyCodeDto: VerifyCodeDto) {
    // 이메일이 유효한지 확인, 자동으로 유효성 검사 실행
    return this.verificationService.verifyCode(verifyCodeDto); // 성공하면 200 상태코드
  }
}
