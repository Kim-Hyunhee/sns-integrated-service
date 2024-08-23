import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyCodeDto {
  @ApiProperty({
    description: 'The verification code sent to the user',
    example: 'skjdfl',
  })
  @IsNotEmpty()
  verificationCode: string;
}
