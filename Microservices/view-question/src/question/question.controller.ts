import { Controller, Get, Param } from '@nestjs/common';
import { QuestionService } from './question.service';

@Controller('view_question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}


  @Get('all/:date_from')
  findAll(@Param('date_from') date_from: Date) {
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
