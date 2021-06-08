
import {Controller, Body, UseGuards, Post, Param, HttpStatus} from '@nestjs/common';
import { AnswerService } from './app.service';
import {CreateAnswerDto} from "./dto/create-answer.dto";
import {paramIdDto} from "./dto/ParamId.dto";
import {MessageDto} from "./dto/Message.dto";
import {JwtAuthGuard} from "./jwt-auth.guard";

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

  @UseGuards(JwtAuthGuard)
  @Post('/:id')
  createAnswer(@Param('id') params: number, @Body() createAnswerDto: CreateAnswerDto) {
    return this.answerService.create(params, createAnswerDto);
  }
}
