import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class GetFeedDto {
  @ApiProperty({
    description: '검색하고 싶은 해시태그',
    example: '맛집',
    required: false,
  })
  @IsString() // 글자 형식 인지
  @IsOptional() // 데이터 비어있어도 괜찮다.
  hashTag?: string;

  @ApiProperty({
    description: 'SNS 종류',
    example: 'twitter',
    required: false,
  })
  @IsString() // 글자 형식 인지
  @IsOptional() // 데이터 비어있어도 괜찮다.
  type?: string;

  @ApiProperty({
    description: '정렬할 기준 열 (예: 생성일, 업데이트일, 좋아요 수 등)',
    required: false,
    enum: ['createdAt', 'updatedAt', 'likeCount', 'viewCount', 'shareCount'],
  })
  @IsString() // 글자 형식 인지
  @IsOptional() // 데이터 비어있어도 괜찮다.
  orderBy?:
    | 'createdAt'
    | 'updatedAt'
    | 'likeCount'
    | 'viewCount'
    | 'shareCount';

  @ApiProperty({
    description: '정렬 순서 (오름차순, 내림차순)',
    required: false,
    enum: ['ASC', 'DESC'],
  })
  @IsEnum(['ASC', 'DESC'])
  @IsOptional()
  range?: 'ASC' | 'DESC';

  @ApiProperty({
    description: '검색 기준 (title, content, 또는 둘 다)',
    required: false,
    enum: ['title', 'content', 'title,content'],
  })
  @IsString() // 글자 형식 인지
  @IsOptional() // 데이터 비어있어도 괜찮다.
  searchBy?: 'title' | 'content' | 'title,content';

  @ApiProperty({
    description: '검색어',
    example: '맛집',
    required: false,
  })
  @IsString() // 글자 형식 인지
  @IsOptional() // 데이터 비어있어도 괜찮다.
  search?: string;

  @ApiProperty({
    description: '페이지 당 게시글 개수',
    example: 10,
    required: false,
  })
  @IsNumber() // 숫자 형식 인지
  @IsOptional() // 데이터 비어있어도 괜찮다.
  @Type(() => Number)
  pageCount?: number;

  @ApiProperty({
    description: '조회할 페이지 번호',
    example: 1,
    required: false,
  })
  @IsNumber() // 숫자 형식 인지
  @IsOptional() // 데이터 비어있어도 괜찮다.
  @Type(() => Number)
  page?: number;
}
