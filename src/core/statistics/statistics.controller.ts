import { Controller, Get } from '@nestjs/common'
import { Auth } from 'src/decorators/auth.decorator'
import { StatisticsService } from './statistics.service'
import { DeepStatistics, MainStatistics } from './types/statistics.types'

@Controller('statistics')
export class StatisticsController {
	constructor(private readonly statisticsService: StatisticsService) {}

	@Get('main')
	@Auth()
	getMainStatistic(): Promise<MainStatistics> {
		return this.statisticsService.getMainStatistic()
	}

	@Get('deep')
	getDeepStatistic(): Promise<DeepStatistics> {
		return this.statisticsService.getDeepStatistic()
	}
}
