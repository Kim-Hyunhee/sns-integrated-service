import { BadRequestException, Injectable } from '@nestjs/common';
import { StatsDto } from './dto/stats.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Feed } from '@app/modules/feed/feed.entity';
import { Repository } from 'typeorm';
import * as dayjs from 'dayjs';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Feed)
    private readonly feedsRepository: Repository<Feed>,
  ) {}
  async getStatistics(statsDto: StatsDto) {
    const { hashtag, type, start, end, value = 'count' } = statsDto;

    // 오늘 날짜
    const today = new Date();

    // 최대 30일 혹은 7일 조건
    // 날짜 차이 계산 (dayjs 사용)
    const startDate = dayjs(
      start ||
        new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7),
    );
    const endDate = dayjs(end || today);
    const dateDiff = endDate.diff(startDate, 'day');
    // 조건 검사
    if (type === 'date' && dateDiff > 30) {
      throw new BadRequestException('최대 30일 간의 데이터만 조회 가능합니다.');
    }
    if (type === 'hour' && dateDiff > 7) {
      throw new BadRequestException('최대 7일 간의 데이터만 조회 가능합니다.');
    }

    // value의 종류에 따라 구분
    if (value === 'count') {
      return this.getCountStatistics(hashtag, type, start, end);
    } else if (value === 'view_count') {
      return this.getViewCountStatistics(hashtag, type, start, end);
    } else if (value === 'like_count') {
      return this.getLikeCountStatistics(hashtag, type, start, end);
    } else if (value === 'share_count') {
      return this.getShareCountStatistics(hashtag, type, start, end);
    } else {
      throw new Error('Invalid value');
    }
  }
  // 1. value = count (게시물 개수)
  private async getCountStatistics(
    hashtag: string,
    type: string,
    start: Date,
    end: Date,
  ) {
    return this.queryStatisticsFeedCount('count', hashtag, type, start, end);
  }
  // 2. value = 기타 (게시물의 조회/좋아요/공유 수)
  private async getViewCountStatistics(
    hashtag: string,
    type: string,
    start: Date,
    end: Date,
  ) {
    return this.queryStatistics('viewCount', hashtag, type, start, end);
  }
  private async getLikeCountStatistics(
    hashtag: string,
    type: string,
    start: Date,
    end: Date,
  ) {
    return this.queryStatistics('likeCount', hashtag, type, start, end);
  }
  private async getShareCountStatistics(
    hashtag: string,
    type: string,
    start: Date,
    end: Date,
  ) {
    return this.queryStatistics('shareCount', hashtag, type, start, end);
  }

  // 1. value = count (게시물 개수)
  private async queryStatisticsFeedCount(
    field: string,
    hashtag: string,
    type: string,
    start: Date,
    end: Date,
  ) {
    const query = this.feedsRepository
      .createQueryBuilder('feedCount')
      .select(
        type === 'date'
          ? 'DATE(feed.createdAt)'
          : 'DATE_FORMAT(feed.createdAt, "%Y=%m-%d %H:00")',
        'dateOrTime',
      )
      .addSelect('COUNT(feed.feedId)', 'count')
      .where('feed.hashtag = :hashtag', { hashtag })
      .andWhere('feed.createdAt BETWEEN :start AND :end', { start, end })
      .groupBy('dateOrTime')
      .orderBy('dateOrTime');

    const result = await query.getRawMany();
    // 예시
    //[
    //  { DateOrTime: '2023-10-01', count: 5 },
    //  { DateOrTime: '2023-10-02', count: 10 },
    //  ...
    //]

    return result.reduce((acc, cur) => {
      acc[cur.dateOrTime] = cur.count;
      return acc;
    }, {});
    // 예시
    // {
    //   '2023-10-01': 5,
    //   '2023-10-02': 10,
    //   ...
    // }
  }

  // 2. value = 기타 (게시물의 조회/좋아요/공유 수)
  private async queryStatistics(
    field: string,
    hashtag: string,
    type: string,
    start: Date,
    end: Date,
  ) {
    const query = this.feedsRepository
      .createQueryBuilder('otherCount')
      .select(
        type === 'date'
          ? 'DATE(feed.createdAt)'
          : 'DATE_FORMAT(feed.createdAt, "%Y=%m-%d %H:00")',
        'dateOrTime',
      )
      .addSelect(`SUM(feed.${field})`, 'count')
      .where('feed.hashtag = :hashtag', { hashtag })
      .andWhere('feed.createdAt BETWEEN :start AND :end', { start, end })
      .groupBy('dateOrTime')
      .orderBy('dateOrTime');

    const result = await query.getRawMany();

    return result.reduce((acc, cur) => {
      acc[cur.dateOrTime] = cur.count;
      return acc;
    }, {});
  }
}
