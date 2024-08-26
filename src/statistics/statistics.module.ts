import { Module } from '@nestjs/common';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feed } from '@app/modules/feed/feed.entity';
import { FeedModule } from '@app/modules/feed/feed.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Feed]), // Feed 리포지토리 등록
    FeedModule, // FeedModule 가져오기
    JwtModule.registerAsync({
      imports: [ConfigModule], // ConfigModule을 import
      inject: [ConfigService], // ConfigService를 inject
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // 환경 변수에서 JWT_SECRET을 가져옴
        signOptions: { expiresIn: '300s' },
      }),
    }),
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
