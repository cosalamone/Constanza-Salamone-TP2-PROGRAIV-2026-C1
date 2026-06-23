import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { UserType } from '../enums/userType.enum';

@Controller('statistics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserType.ADMIN)
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('publications-per-user')
  getPublicationsPerUser(
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.statisticsService.publicationsPerUser(from, to);
  }

  @Get('comments-per-period')
  getCommentsPerPeriod(
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.statisticsService.commentsPerPeriod(from, to);
  }

  @Get('comments-per-publication')
  getCommentsPerPublication(
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.statisticsService.commentsPerPublication(from, to);
  }
}
