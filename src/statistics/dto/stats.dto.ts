import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';

export class StatsDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: '검색하고 싶은 해시태그(기본값: 로그인된 계정명)',
    example: '맛집',
    required: false,
  })
  hashtag?: string;

  // 필수 값
  @IsEnum(['date', 'hour'])
  @ApiProperty({
    description: '날짜별 조회 또는 시간별 조회 선택',
    example: 'date',
    required: true,
  })
  type?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    description: '조회 시작일',
    example: '2024-08-19',
    required: false,
  })
  start?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    description: '조회 종료일',
    example: '2024-08-26',
    required: false,
  })
  end?: Date;

  @IsEnum(['count', 'view_count', 'like_count', 'share_count'])
  @ApiProperty({
    description: '조회하고자 하는 값',
    example: 'count',
    required: true,
  })
  value?: string = 'count';
}
