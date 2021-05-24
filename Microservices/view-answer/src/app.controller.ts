import {Controller, Get, Param} from '@nestjs/common';
import { ViewAnswerService } from './app.service';
import {paramIdDto} from "./dto/ParamId.dto";

@Controller('view_answer')
export class ViewAnswerController {
  constructor(private readonly viewAnswerService: ViewAnswerService) {}

  @Get('for_question/:id')
  findQuestionAnswers(@Param('id') id: number) {
    return this.viewAnswerService.findQuestionAnswers(id)
  }

  @Get('for_user/:id')
  findAnswersForUser(@Param('id') id: number) {
    return this.viewAnswerService.findAnswersForUser(id)
  }
}
