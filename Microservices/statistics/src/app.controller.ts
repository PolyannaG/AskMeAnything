import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import { StatisticsService } from './app.service';
import {MessageAnswerDto} from "./dto/Message-answer.dto";
import {MessageQuestionDto} from "./dto/Message-question.dto";
//import {JwtAuthGuard} from "../jwt-auth.guard";

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  async onModuleInit() {
    await this.statisticsService.subscribeAnswers();
    await this.statisticsService.subscribeQuestions();
    await this.statisticsService.retrieveLostAnswerMessages();
    await this.statisticsService.retrieveLostQuestionMessages();
    return "Subscribed and retrieved messages successfully";
  }

  @Post('answer_message')
  updateAnswers(@Body() msgAnswerDto : MessageAnswerDto) {
    return this.statisticsService.updateAnswersDatabase(msgAnswerDto)
  }

  @Post('question_message')
  updateQuestions(@Body() msgQuestionDto : MessageQuestionDto) {
    return this.statisticsService.updateQuestionDatabase(msgQuestionDto)
  }

  @Get('keywords')
  findByKeywords() {
    return this.statisticsService.findByKeywords()
  }


  @Get('keywords_user/:Userid')
  findByKeywordsUser(@Param('Userid') Userid : number)  {
    return this.statisticsService.findByKeywordsUser(Userid)
  }

  @Get('per_day/questions')
  showQuestionsPerDay(){
    return this.statisticsService.showQuestionsPerDay()
  }

  @Get('per_day_user/questions/:Userid')
  showQuestionsPerDayUser(@Param('Userid') Userid : number){
    return this.statisticsService.showQuestionsPerDayUser(Userid)
  }

  @Get('per_day/answers')
  showAnswersPerDay(){
    return this.statisticsService.showAnswersPerDay()
  }

  @Get('per_day_user/answers/:Userid')
  showAnswersPerDayUser(@Param('Userid') Userid : number){
    return this.statisticsService.showAnswersPerDayUser(Userid)
  }

}
