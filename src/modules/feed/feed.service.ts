import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feed } from './feed.entity';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(Feed) private feedsRepository: Repository<Feed>,
  ) {}

  async fetchManyFeed({
    hashTag,
    type,
    orderBy,
    range,
    searchBy,
    search,
    pageCount,
    page,
  }: {
    hashTag?: string;
    type?: string;
    orderBy?: string;
    range?: 'ASC' | 'DESC';
    searchBy?: 'title' | 'content' | 'title,content';
    search?: string;
    pageCount?: number;
    page?: number;
  }) {
    const PAGE_SIZE = pageCount ? pageCount : 10;
    const skipAmount = page ? (page - 1) * PAGE_SIZE : 0;

    const queryBuilder = this.feedsRepository.createQueryBuilder('feed');

    // type 조건
    if (type) {
      queryBuilder.andWhere('feed.type = :type', { type });
    }

    // hashtags JSON 배열에서 특정 태그 검색
    if (hashTag) {
      queryBuilder.andWhere('feed.hashtags ::jsonb @> :hashTag', {
        hashTag: `[${hashTag}]`,
      });
    }

    // search 조건
    if (search && searchBy) {
      if (searchBy === 'title,content') {
        queryBuilder.andWhere(
          '(feed.title LIKE :search OR feed.content LIKE :search)',
          { search: `%${search}%` },
        );
      } else {
        queryBuilder.andWhere(`feed.${searchBy} LIKE :search`, {
          search: `%${search}%`,
        });
      }
    }

    // 정렬 조건
    if (orderBy) {
      queryBuilder.orderBy(`feed.${orderBy}` || 'createdAt', range || 'ASC');
    }

    // 페이지네이션
    queryBuilder.skip(skipAmount).take(PAGE_SIZE);

    return await queryBuilder.getMany();
  }
}
