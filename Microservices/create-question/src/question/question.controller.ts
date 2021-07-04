import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  UnauthorizedException,
  ServiceUnavailableException
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import {JwtAuthGuard} from "./jwt-auth.guard";
import {MessageAnswerDto} from "./dto/Message-answer.dto";
import {Request} from "express";

@Controller('create_question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  /*async onModuleInit() {
    await this.questionService.answerSubscribe();
    await this.questionService.retrieveLostMessages();
    return "Subscribed and retrieved messages successfully";
  }

  @Post('message')
  updateDatabase(@Body() msgDto : MessageAnswerDto) {
    return this.questionService.updateSumAnswers(msgDto)
  }*/

  //@UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() request: Request, @Body() createQuestionDto: CreateQuestionDto) {
    let auth = await this.questionService.auth(request);
    if (auth) {
      let cookieUserId = await this.questionService.cookieUserId(request);
      if (cookieUserId == createQuestionDto.Userid) {
        return this.questionService.create(createQuestionDto);
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
