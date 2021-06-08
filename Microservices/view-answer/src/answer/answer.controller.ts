import {Body, Controller, Get, Param, Post, UseGuards} from '@nestjs/common';
import {ViewAnswerService} from "./answer.service";
import {MessageDto} from "./dto/Message.dto";
import {JwtAuthGuard} from "./jwt-auth.guard";
;


@Controller('view_answer')
export class ViewAnswerController {
  constructor(private readonly viewAnswerService: ViewAnswerService) {}

  async onModuleInit() {
    await this.viewAnswerService.subscribe()
    await this.viewAnswerService.retrieveLostMessages();
    return "Subscribed and retrieved messages successfully";
  }

  @Post('message')
  updateDatabase(@Body() msgDto : MessageDto) {
    return this.viewAnswerService.updateAnswersDatabase(msgDto)
  }

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

}
