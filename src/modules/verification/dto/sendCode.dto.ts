import { IsHexadecimal, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendCodeDto {
  @ApiProperty({
    description: 'User ID (Hex format)',
    example: '9a0b10d2f3a4e5b6c7d8e9f0a1b2c3d4', // 프론트에서 hex 형식으로 변환해 전달하는 것이 서버에 부담을 줄여줌
  })
  @IsHexadecimal() // UUID 형식 검증
  @IsNotEmpty() // 데이터 비어있지 않도록 검증
  userId: string;
}
