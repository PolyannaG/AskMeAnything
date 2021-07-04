import {
  Controller,
  Body,
  UseGuards,
  Post,
  Param,
  HttpStatus,
  UnauthorizedException,
  ServiceUnavailableException, Req
} from '@nestjs/common';

import {MessageDto} from "./dto/Message.dto";
import {CreateAnswerDto} from "./dto/create-answer.dto";
import {JwtAuthGuard} from "./jwt-auth.guard";
import {AnswerService} from "./answer.service";
import {Request} from "express";


@Controller('create_answer')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  async onModuleInit() {
    await this.answerService.subscribe();
    await this.answerService.retrieveLostMessages();
    return "Subscribed and retrieved messages successfully";
  }

  @Post('/message')
  updateDatabase(@Body() msgDto : MessageDto ) {
    return this.answerService.updateQuestionDatabase(msgDto);
  }

  //@UseGuards(JwtAuthGuard)
  @Post('/:id')
  async createAnswer(@Req() request: Request, @Param('id') params: number, @Body() createAnswerDto: CreateAnswerDto) {
    let auth = await this.answerService.auth(request);
    if (auth) {
      let cookieUserId = await this.answerService.cookieUserId(request);
      if (cookieUserId == createAnswerDto.Userid) {
        return this.answerService.create(params, createAnswerDto);
      }
      else //(userId of url) != (userId of token) so unauthorized to create a answer as another user
        throw new UnauthorizedException()
    }
    else if (auth === false)
      throw new UnauthorizedException()
    else
      throw new ServiceUnavailableException()
  }
}
