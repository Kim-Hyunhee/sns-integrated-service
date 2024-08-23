import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FeedService } from './feed.service';
import { GetFeedDto } from './dto/getFeed.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserGuard } from '../user/user.guard';

@ApiTags('feeds')
@Controller('feeds')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @UseGuards(UserGuard)
  @Get()
  @ApiBearerAuth('token')
  async getManyFeed(@Query() query: GetFeedDto) {
    return await this.feedService.fetchManyFeed(query);
  }

  @UseGuards(UserGuard)
  @Get(':id')
  @ApiBearerAuth('token')
  async GetFeedDto(@Param('id', ParseIntPipe) id: number) {
    await this.feedService.updateFeedViewCount({ id });
    return await this.feedService.getFeed({ id });
  }

  @UseGuards(UserGuard)
  @Patch(':id/likeCount')
  @ApiBearerAuth('token')
  async patchFeedLikeCount(@Param('id', ParseIntPipe) id: number) {
    return await this.feedService.updateFeedLikeCount({ id });
  }

  @UseGuards(UserGuard)
  @Patch(':id/shareCount')
  @ApiBearerAuth('token')
  async patchFeedShareCount(@Param('id', ParseIntPipe) id: number) {
    return await this.feedService.updateFeedShareCount({ id });
  }
}
