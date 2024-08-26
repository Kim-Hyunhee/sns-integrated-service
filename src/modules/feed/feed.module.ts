import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feed } from './feed.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Feed]),
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule], // ConfigModule을 import
      inject: [ConfigService], // ConfigService를 inject
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // 환경 변수에서 JWT_SECRET을 가져옴
        signOptions: { expiresIn: '300s' },
      }),
    }),
  ],
  providers: [FeedService],
  controllers: [FeedController],
  exports: [TypeOrmModule],
})
export class FeedModule {}
