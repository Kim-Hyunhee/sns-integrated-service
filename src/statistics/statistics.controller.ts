import { Controller, Get, UseGuards, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';
import { UserGuard } from '@app/modules/user/user.guard';
import { StatsDto } from './dto/stats.dto';

@UseGuards(UserGuard)
@ApiBearerAuth()
@ApiTags('statistics')
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  // 통계
  @ApiResponse({ status: 200, description: '조회되었습니다.' })
  @ApiResponse({
    status: 400,
    description: '조회 기간이 잘못되었습니다.',
  })
  @Get()
  async statistics(
    @Query() statsDto: StatsDto,
    @Request() req, // 로그인된 사용자 정보를 받아옴
  ) {
    // 로그인된 사용자 정보 가져오기
    const currentUser = req.user;
    const hashtag = statsDto.hashtag || currentUser.account; // 기본값 설정: 로그인된 사용자의 계정명

    // 기본값이 설정된 DTO로 서비스 호출
    return this.statisticsService.getStatistics({
      ...statsDto,
      hashtag, // 덮어씌운 hashtag 값을 전달
    });
  }
}
