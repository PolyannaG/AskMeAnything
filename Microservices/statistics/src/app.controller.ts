import {Controller, Get, Param, UseGuards} from '@nestjs/common';
import { StatisticsService } from './app.service';
//import {JwtAuthGuard} from "../jwt-auth.guard";

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly questionService: StatisticsService) {}

  @Get('keywords')
  findByKeywords() {
    return this.questionService.findByKeywords()
  }


  @Get('keywords_user/:Userid')
  findByKeywordsUser(@Param('Userid') Userid : number)  {
    return this.questionService.findByKeywordsUser(Userid)
  }

  @Get('per_day/questions')
  showQuestionsPerDay(){
    return this.questionService.showQuestionsPerDay()
  }

  @Get('per_day_user/questions/:Userid')
  showQuestionsPerDayUser(@Param('Userid') Userid : number){
    return this.questionService.showQuestionsPerDayUser(Userid)
  }

  @Get('per_day/answers')
  showAnswersPerDay(){
    return this.questionService.showAnswersPerDay()
  }

  @Get('per_day_user/answers/:Userid')
  showAnswersPerDayUser(@Param('Userid') Userid : number){
    return this.questionService.showAnswersPerDayUser(Userid)
  }

}
