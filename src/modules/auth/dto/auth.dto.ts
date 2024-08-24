import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class Register {
  @IsEmail()
  @ApiProperty({
    description: '이메일 주소',
    example: 'dani@example.com',
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    description: '비밀번호',
    example: 'ekslek1954',
  })
  password: string;

  @IsNotEmpty()
  @ApiProperty({
    description: '계정',
    example: 'dani',
  })
  account: string;
}

// export class Login {

// }
