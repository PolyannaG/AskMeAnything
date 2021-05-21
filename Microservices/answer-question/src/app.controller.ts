import { Controller, Body, Post, Param } from '@nestjs/common';
import { AnswerService } from './app.service';
import {CreateAnswerDto} from "./dto/create-answer.dto";
import {paramIdDto} from "./dto/ParamId.dto";

@Controller('create_answer')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Post(':QuestionId')
  createAnswer(@Param() params: paramIdDto, @Body() createAnswerDto: CreateAnswerDto) {
    return this.answerService.create(params, createAnswerDto);
  }
}
