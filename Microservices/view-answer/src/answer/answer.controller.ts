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
import {ViewAnswerService} from "./answer.service";
import {MessageDto} from "./dto/Message.dto";
import {JwtAuthGuard} from "./jwt-auth.guard";
import {Request} from "express";


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

  //@UseGuards(JwtAuthGuard)
  @Get('for_user/:id')
  async findAnswersForUser(@Req() request: Request, @Param('id') id: number) {
    let auth = await this.viewAnswerService.auth(request);
    if (auth) {
      let cookieUserId = await this.viewAnswerService.cookieUserId(request);
      if (cookieUserId == id) {
        return this.viewAnswerService.findAnswersForUser(id)
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
  @Get('all_user/:userid/:date_from')
  async findAllDate(@Req() request: Request, @Param('date_from') date_from: Date, @Param('userid') userid : Number) {
    let auth = await this.viewAnswerService.auth(request);
    if (auth) {
      let cookieUserId = await this.viewAnswerService.cookieUserId(request);
      if (cookieUserId == userid) {
        return this.viewAnswerService.findAllDate(date_from, userid)
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
