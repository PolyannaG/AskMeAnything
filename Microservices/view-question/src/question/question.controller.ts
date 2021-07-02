import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  ServiceUnavailableException,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common';
import { QuestionService } from './question.service';
import {JwtAuthGuard} from "./jwt-auth.guard";
import {JwtService} from "@nestjs/jwt";
import {Response, Request} from "express";
import {MessageQuestionDto} from "./dto/Message-question.dto";
import {MessageAnswerDto} from "./dto/Message-answer.dto";


@Controller('view_question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService,
              private readonly jwtService: JwtService) {}

  async onModuleInit() {
    await this.questionService.subscribeAnswers();
    await this.questionService.subscribeQuestions();
    await this.questionService.retrieveLostAnswerMessages();
    await this.questionService.retrieveLostQuestionMessages();
    return "Subscribed and retrieved messages successfully";
  }

  @Post('question_message')
  updateDatabase(@Body() msgDto : MessageQuestionDto) {
    return this.questionService.updateQuestionDatabases(msgDto)
  }

  @Post('answer_message')
  updateSumAnswers(@Body() msgDto : MessageAnswerDto) {
    return this.questionService.updateSumAnswers(msgDto)
  }

  //@UseGuards(JwtAuthGuard)
  @Get('all/:date_from')
  async findAll(@Req() request: Request, @Param('date_from',) date_from: Date) {
    let auth = await this.questionService.auth(request);
    if (auth)
      return this.questionService.findAll(date_from)
    else if (auth === false)
      throw new UnauthorizedException()
    else
      throw new ServiceUnavailableException()
  }

  //@UseGuards(JwtAuthGuard)
  @Get('all_titles')
  async findAllTitles(@Req() request: Request) {
    let auth = await this.questionService.auth(request);
    if (auth)
      return this.questionService.findAllTitles()
    else if (auth === false)
      throw new UnauthorizedException()
    else
      throw new ServiceUnavailableException()
  }

  //@UseGuards(JwtAuthGuard)
  @Get('all_user/:date_from/:Userid')
  async findAllUser(@Req() request: Request, @Param('date_from') date_from: Date, @Param('Userid') Userid : number) {
    let auth = await this.questionService.auth(request);
    if (auth) {
      let cookieUserId = await this.questionService.cookieUserId(request);
      if (cookieUserId == Userid) {
        return this.questionService.findAllUser(date_from, Userid)
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
  @Get('id/:id')
  async findOne(@Req() request: Request, @Param('id') id: number) {
    let auth = await this.questionService.auth(request);
    if (auth)
      return this.questionService.findOne(+id)
    else if (auth === false)
      throw new UnauthorizedException()
    else
      throw new ServiceUnavailableException()
  }

  @Get('most_popular')
  getMostPopular(){
      return this.questionService.getMostPopular()
  }

  //@UseGuards(JwtAuthGuard)
  @Get('start_end_date/:date_from/:date_to')
  async filterByStartAndEndDate(@Req() request: Request, @Param('date_from') date_from: Date, @Param('date_to') date_to: Date){
    let auth = await this.questionService.auth(request);
    if (auth)
      return this.questionService.filterByStartAndEndDate(date_from, date_to)
    else if (auth === false)
      throw new UnauthorizedException()
    else
      throw new ServiceUnavailableException()

  }

  //@UseGuards(JwtAuthGuard)
  @Get('start_end_date_user/:userid/:date_from/:date_to')
  async filterByStartAndEndDateUser(@Req() request: Request, @Param('date_from') date_from: Date, @Param('date_to') date_to: Date, @Param('userid') Userid :number){
    let auth = await this.questionService.auth(request);
    if (auth) {
      let cookieUserId = await this.questionService.cookieUserId(request);
      if (cookieUserId == Userid) {
        return this.questionService.filterByStartAndEndDateUser(date_from, date_to, Userid)
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
  @Get('keyword_date/:keyword/:date_from')
  async filterByKeywordDateFrom(@Req() request: Request, @Param('keyword') keyword: String, @Param('date_from') date_from: Date){
    let auth = await this.questionService.auth(request);
    if (auth)
      return this.questionService.filterByKeywordDateFrom(keyword, date_from)
    else if (auth === false)
      throw new UnauthorizedException()
    else
      throw new ServiceUnavailableException()
  }

  //@UseGuards(JwtAuthGuard)
  @Get('keyword_date_user/:keyword/:userid/:date_from')
  async filterByKeywordDateFromUser(@Req() request: Request, @Param('keyword') keyword: String, @Param('date_from') date_from: Date, @Param('userid') Userid: number){
    let auth = await this.questionService.auth(request);
    if (auth) {
      let cookieUserId = await this.questionService.cookieUserId(request);
      if (cookieUserId == Userid) {
        return this.questionService.filterByKeywordDateFromUser(keyword, date_from, Userid)
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
  @Get('keyword_date_from_to/:keyword/:date_from/:date_to')
  async filterByKeywordDateFromTo(@Req() request: Request, @Param('keyword') keyword: String, @Param('date_from', ) date_from: Date,  @Param('date_to', ) date_to: Date){
    let auth = await this.questionService.auth(request);
    if (auth)
      return this.questionService.filterByKeywordDateFromTo(keyword, date_from, date_to)
    else if (auth === false)
      throw new UnauthorizedException()
    else
      throw new ServiceUnavailableException()
  }

  //@UseGuards(JwtAuthGuard)
  @Get('keyword_date_from_to_user/:keyword/:userid/:date_from/:date_to')
  async filterByKeywordDateFromToUser(@Req() request: Request, @Param('keyword') keyword: String, @Param('date_from') date_from: Date,  @Param('date_to', ) date_to: Date, @Param('userid') Userid: number){
    let auth = await this.questionService.auth(request);
    if (auth) {
      let cookieUserId = await this.questionService.cookieUserId(request);
      if (cookieUserId == Userid) {
        return this.questionService.filterByKeywordDateFromToUser(keyword, date_from, date_to, Userid)
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
  @Get('all_keywords')
  async findAllKeywords(@Req() request: Request){
    let auth = await this.questionService.auth(request);
    if (auth)
      return this.questionService.findAllKeywords()
    else if (auth === false)
      throw new UnauthorizedException()
    else
      throw new ServiceUnavailableException()
  }

  //@UseGuards(JwtAuthGuard)
  @Get('specific_keywords/:keyword')
  async findSpecificKeywords(@Req() request: Request, @Param('keyword') keyword: String){
    let auth = await this.questionService.auth(request);
    if (auth)
      return this.questionService.findSpecificKeywords(keyword)
    else if (auth === false)
      throw new UnauthorizedException()
    else
      throw new ServiceUnavailableException()
  }

/*
  @UseGuards(JwtAuthGuard)
  @Get('count_questions_user/:Userid')
  countQuestionsUser(@Param('Userid') Userid : number){
    return this.questionService.countQuestionsUser(Userid)
  }
 */

}
