import {Controller, Get, Param, UseGuards} from '@nestjs/common';
import { ViewAnswerService } from './app.service';
import {paramIdDto} from "./dto/ParamId.dto";
import {JwtAuthGuard} from "./jwt-auth.guard";

@Controller('view_answer')
export class ViewAnswerController {
  constructor(private readonly viewAnswerService: ViewAnswerService) {}


  @Get('for_question/:id')
  findQuestionAnswers(@Param('id') id: number) {
    return this.viewAnswerService.findQuestionAnswers(id)
  }

  @UseGuards(JwtAuthGuard)
  @Get('for_user/:id')
  findAnswersForUser(@Param('id') id: number) {
    return this.viewAnswerService.findAnswersForUser(id)
  }

  @UseGuards(JwtAuthGuard)
  @Get('all_user/:userid/:date_from')
  findAllDate(@Param('date_from') date_from: Date, @Param('userid') userid : Number) {
    return this.viewAnswerService.findAllDate(date_from, userid)
  }
/*
  @UseGuards(JwtAuthGuard)
  @Get('per_day_user/:Userid')
  showAnswersPerDayUser(@Param('Userid') Userid : number){
    return this.viewAnswerService.showAnswerPerDayUser(Userid)
  }

  @UseGuards(JwtAuthGuard)
  @Get('count_answers_user/:Userid')
  countAnswersUser(@Param('Userid') Userid : number){
    return this.viewAnswerService.countAnswersUser(Userid)
  }

 */

}
