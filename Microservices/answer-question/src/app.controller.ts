import {Controller, Body, Post, Param, UseGuards} from '@nestjs/common';
import { AnswerService } from './app.service';
import {CreateAnswerDto} from "./dto/create-answer.dto";
import {paramIdDto} from "./dto/ParamId.dto";
import {JwtAuthGuard} from "./jwt-auth.guard";

@Controller('create_answer')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/:id')
  createAnswer(@Param('id') params: number, @Body() createAnswerDto: CreateAnswerDto) {
    return this.answerService.create(params, createAnswerDto);
  }
}
