import {Body, Controller, Get, Param, Post, Req, UseGuards} from '@nestjs/common';
import { QuestionService } from './question.service';
import {JwtAuthGuard} from "./jwt-auth.guard";

import {JwtService} from "@nestjs/jwt";
import {Response, Request} from "express";
import {MessageDto} from "./dto/Message.dto";


@Controller('view_question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService, private readonly jwtService: JwtService) {}

  async onModuleInit() {
    return this.questionService.subscribe()
  }

  @Post('message')
  updateDatabase(@Body() msgDto : MessageDto) {
    return this.questionService.updateDatabases(msgDto)
  }

  // @UseGuards(JwtAuthGuard)
  @Get('all/:date_from')
  findAll(@Param('date_from',) date_from: Date) {
    return this.questionService.findAll(date_from)
  }

  @Get('all/:date_from/:Userid')
  findAllUser(@Param('date_from') date_from: Date, @Param('Userid') Userid : number) {
  return this.questionService.findAllUser(date_from, Userid)
}

  @Get('id/:id')
  findOne(@Param('id') id: number) {
    return this.questionService.findOne(+id)
  }

  @Get('keywords')
  findByKeywords() {
    return this.questionService.findByKeywords()
  }


  @Get('keywords_user/:Userid')
  findByKeywordsUser(@Param('Userid') Userid : number)  {
    return this.questionService.findByKeywordsUser(Userid)
  }

  @Get('per_day')
    showPerDay(){
      return this.questionService.showPerDay()
  }

  @Get('per_day_user/:Userid')
  showPerDayUser(@Param('Userid') Userid : number){
      return this.questionService.showPerDayUser(Userid)
  }

  @Get('most_popular')
  getMostPopular(){
      return this.questionService.getMostPopular()
  }

}
