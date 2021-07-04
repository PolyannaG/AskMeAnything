import {
  Body,
  Controller,
  Get,
  Param,
  Post, Req,
  ServiceUnavailableException,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common';
import {StatisticsService} from "./stats.service";
import {MessageAnswerDto} from "./dto/Message-answer.dto";
import {MessageQuestionDto} from "./dto/Message-question.dto";
import {JwtAuthGuard} from "./jwt-auth.guard";
import {Request} from "express";


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

  //@UseGuards(JwtAuthGuard)
  @Get('keywords_user/:Userid')
  async findByKeywordsUser(@Req() request: Request, @Param('Userid') Userid : number)  {
    let auth = await this.statisticsService.auth(request);
    if (auth) {
      let cookieUserId = await this.statisticsService.cookieUserId(request);
      if (cookieUserId == Userid) {
        return this.statisticsService.findByKeywordsUser(Userid)
      }
      else //(userId of url) != (userId of token) so unauthorized to create a question as another user
        throw new UnauthorizedException()
    }
    else if (auth === false)
      throw new UnauthorizedException()
    else
      throw new ServiceUnavailableException()
  }

  @Get('per_day/questions')
  showQuestionsPerDay(){
    return this.statisticsService.showQuestionsPerDay()
  }

  //@UseGuards(JwtAuthGuard)
  @Get('per_day_user/questions/:Userid')
  async showQuestionsPerDayUser(@Req() request: Request, @Param('Userid') Userid : number){
    let auth = await this.statisticsService.auth(request);
    if (auth) {
      let cookieUserId = await this.statisticsService.cookieUserId(request);
      if (cookieUserId == Userid) {
        return this.statisticsService.showQuestionsPerDayUser(Userid)
      }
      else //(userId of url) != (userId of token) so unauthorized to create a question as another user
        throw new UnauthorizedException()
    }
    else if (auth === false)
      throw new UnauthorizedException()
    else
      throw new ServiceUnavailableException()
  }


  @Get('per_day/answers')
  showAnswersPerDay(){
    return this.statisticsService.showAnswersPerDay()
  }

  //@UseGuards(JwtAuthGuard)
  @Get('per_day_user/answers/:Userid')
  async showAnswersPerDayUser(@Req() request: Request, @Param('Userid') Userid : number){
    let auth = await this.statisticsService.auth(request);
    if (auth) {
      let cookieUserId = await this.statisticsService.cookieUserId(request);
      if (cookieUserId == Userid) {
        return this.statisticsService.showAnswersPerDayUser(Userid)
      }
      else //(userId of url) != (userId of token) so unauthorized to create a question as another user
        throw new UnauthorizedException()
    }
    else if (auth === false)
      throw new UnauthorizedException()
    else
      throw new ServiceUnavailableException()
  }

  //@UseGuards(JwtAuthGuard)
  @Get('count_answers_user/:Userid')
  async countAnswersUser(@Req() request: Request, @Param('Userid') Userid : number){
    let auth = await this.statisticsService.auth(request);
    if (auth) {
      let cookieUserId = await this.statisticsService.cookieUserId(request);
      if (cookieUserId == Userid) {
        return this.statisticsService.countAnswersUser(Userid)
      }
      else //(userId of url) != (userId of token) so unauthorized to create a question as another user
        throw new UnauthorizedException()
    }
    else if (auth === false)
      throw new UnauthorizedException()
    else
      throw new ServiceUnavailableException()
  }

  //@UseGuards(JwtAuthGuard)
  @Get('count_questions_user/:Userid')
  async countQuestionsUser(@Req() request: Request, @Param('Userid') Userid : number){
    let auth = await this.statisticsService.auth(request);
    if (auth) {
      let cookieUserId = await this.statisticsService.cookieUserId(request);
      if (cookieUserId == Userid) {
        return this.statisticsService.countQuestionsUser(Userid)
      }
      else //(userId of url) != (userId of token) so unauthorized to create a question as another user
        throw new UnauthorizedException()
    }
    else if (auth === false)
      throw new UnauthorizedException()
    else
      throw new ServiceUnavailableException()
  }

}
