import {Controller, Get, Param, UseGuards} from '@nestjs/common';
import { StatisticsService } from './app.service';
import {JwtAuthGuard} from "./jwt-auth.guard";

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly questionService: StatisticsService) {}


  @Get('keywords')
  findByKeywords() {
    return this.questionService.findByKeywords()
  }

  @UseGuards(JwtAuthGuard)
  @Get('keywords_user/:Userid')
  findByKeywordsUser(@Param('Userid') Userid : number)  {
    return this.questionService.findByKeywordsUser(Userid)
  }

  @Get('per_day/questions')
  showQuestionsPerDay(){
    return this.questionService.showQuestionsPerDay()
  }

  @UseGuards(JwtAuthGuard)
  @Get('per_day_user/questions/:Userid')
  showQuestionsPerDayUser(@Param('Userid') Userid : number){
    return this.questionService.showQuestionsPerDayUser(Userid)
  }

  @UseGuards(JwtAuthGuard)
  @Get('per_day/answers')
  showAnswersPerDay(){
    return this.questionService.showAnswersPerDay()
  }

  @UseGuards(JwtAuthGuard)
  @Get('per_day_user/answers/:Userid')
  showAnswersPerDayUser(@Param('Userid') Userid : number){
    return this.questionService.showAnswersPerDayUser(Userid)
  }

  @UseGuards(JwtAuthGuard)
  @Get('count_answers_user/:Userid')
  countAnswersUser(@Param('Userid') Userid : number){
    return this.questionService.countAnswersUser(Userid)
  }

  @UseGuards(JwtAuthGuard)
  @Get('count_questions_user/:Userid')
  countQuestionsUser(@Param('Userid') Userid : number){
    return this.questionService.countQuestionsUser(Userid)
  }

}
