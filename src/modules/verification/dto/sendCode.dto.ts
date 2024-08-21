import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendCodeDto {
  @ApiProperty({
    description: 'Email address to send the verification code',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: '이메일 형식이 올바르지 않습니다.' }) // 이메일 형식 확인
  @IsNotEmpty() // 데이터 비어있지 않도록 검증
  email: string;
}
