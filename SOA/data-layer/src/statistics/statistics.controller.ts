import {Body, Controller, Get, Param} from '@nestjs/common';
import {StatisticsService} from "./statistics.service";

@Controller('statistics')
export class StatisticsController {
    constructor(private readonly statisticsService: StatisticsService) {}

    @Get('findByKeywords')
    findByKeywords() {
        return this.statisticsService.findByKeywordsQuery()
    }

    @Get('findByKeywordsUser')
    findByKeywordsUser(@Param('Userid') Userid : number) {
        return this.statisticsService.findByKeywordsUserQuery(Userid)
    }

    @Get('showQuestionsPerDay')
    showQuestionsPerDay() {
        return this.statisticsService.showQuestionsPerDayQuery()
    }

    @Get('showQuestionsPerDayUser')
    showQuestionsPerDayUser(@Param('Userid') Userid : number) {
        return this.statisticsService.showQuestionsPerDayUserQuery(Userid)
    }

    @Get('showAnswersPerDay')
    showAnswersPerDay() {
        return this.statisticsService.showAnswersPerDayQuery()
    }

    @Get('showAnswersPerDayUser')
    showAnswersPerDayUser(@Param('Userid') Userid : number) {
        return this.statisticsService.showAnswersPerDayUserQuery(Userid)
    }

    @Get('countAnswersUser')
    countAnswersUser(@Param('Userid') Userid : number) {
        return this.statisticsService.countAnswersUserQuery(Userid)
    }

    @Get('countQuestionsUser')
    countQuestionsUser(@Param('Userid') Userid : number) {
        return this.statisticsService.countQuestionsUserQuery(Userid)
    }


}
