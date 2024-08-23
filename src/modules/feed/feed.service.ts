import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feed } from './feed.entity';
import axios from 'axios';

const getFacebookFeed = axios.create({
  baseURL: 'https://www.facebook.com/',
  withCredentials: true,
});
const getTwitterFeed = axios.create({
  baseURL: 'https://www.twitter.com/',
  withCredentials: true,
});
const getinstagramFeed = axios.create({
  baseURL: 'https://www.instagram.com/',
  withCredentials: true,
});
const getThreadsFeed = axios.create({
  baseURL: 'https://www.threads.net/',
  withCredentials: true,
});

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

  async getFeed({ id }: { id: number }) {
    const feed = await this.feedsRepository.findOne({ where: { feedId: id } });

    if (!feed) {
      throw new NotFoundException('해당 게시글을 찾을 수 없습니다.'); // 404 상태코드
    } else {
      return feed;
    }
  }

  async updateFeedViewCount({ id }: { id: number }) {
    const feed = await this.getFeed({ id });

    return await this.feedsRepository.update(
      { feedId: id },
      { viewCount: feed.viewCount + 1 },
    );
  }

  async updateFeedLikeCount({ id }: { id: number }) {
    const feed = await this.getFeed({ id });
    try {
      if (feed.type === 'facebook') {
        await getFacebookFeed.put('like');
      } else if (feed.type === 'twitter') {
        await getTwitterFeed.put('like');
      } else if (feed.type === 'instagram') {
        await getinstagramFeed.put('like');
      } else {
        await getThreadsFeed.put('like');
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        await this.feedsRepository.update(
          { feedId: id },
          {
            likeCount: feed.likeCount + 1,
          },
        );
        // like count 가 +1 된 feed를 다시 가져와서 return 해준다.
        const updatedFeed = await this.getFeed({ id });

        return {
          success: true,
          updatedFeed,
        };
      } else {
        // 다른 오류는 그대로 throw
        throw error;
      }
    }
  }
}
