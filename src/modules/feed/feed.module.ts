import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feed } from './feed.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Feed])],
  providers: [FeedService],
  controllers: [FeedController],
  exports: [TypeOrmModule],
})
export class FeedModule {}
