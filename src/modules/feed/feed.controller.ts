import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { FeedService } from './feed.service';
import { GetFeedDto } from './dto/getFeed.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('feeds')
@Controller('feeds')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get()
  async getManyFeed(@Query() query: GetFeedDto) {
    return await this.feedService.fetchManyFeed(query);
  }

  @Get(':id')
  async GetFeedDto(@Param('id', ParseIntPipe) id: number) {
    await this.feedService.updateFeedViewCount({ id });
    return await this.feedService.getFeed({ id });
  }
}
