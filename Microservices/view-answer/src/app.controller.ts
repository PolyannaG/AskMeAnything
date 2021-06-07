import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import { ViewAnswerService } from './app.service';
import {paramIdDto} from "./dto/ParamId.dto";
import {MessageDto} from "./dto/Message.dto";

@Controller('view_answer')
export class ViewAnswerController {
  constructor(private readonly viewAnswerService: ViewAnswerService) {}

  async onModuleInit() {
    return this.viewAnswerService.subscribe()
  }

  @Post('message')
  updateDatabase(@Body() msgDto : MessageDto) {
    return this.viewAnswerService.updateAnswersDatabase(msgDto)
  }

  @Get('for_question/:id')
  findQuestionAnswers(@Param('id') id: number) {
    return this.viewAnswerService.findQuestionAnswers(id)
  }

  @Get('for_user/:id')
  findAnswersForUser(@Param('id') id: number) {
    return this.viewAnswerService.findAnswersForUser(id)
  }
}
