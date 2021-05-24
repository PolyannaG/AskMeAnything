import { Controller, Body, Post, Param } from '@nestjs/common';
import { AnswerService } from './app.service';
import {CreateAnswerDto} from "./dto/create-answer.dto";
import {paramIdDto} from "./dto/ParamId.dto";

@Controller('create_answer')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Post('/:id')
  createAnswer(@Param('id') params: number, @Body() createAnswerDto: CreateAnswerDto) {
    return this.answerService.create(params, createAnswerDto);
  }
}
