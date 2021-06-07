import {Controller, Post, Body,UseGuards} from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import {JwtAuthGuard} from "./jwt-auth.guard";
import {MessageAnswerDto} from "./dto/Message-answer.dto";

@Controller('create_question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  async onModuleInit() {
    await this.questionService.answerSubscribe();
    await this.questionService.retrieveLostMessages();
    return "Subscribed and retrieved messages successfully";
  }

  @Post('message')
  updateDatabase(@Body() msgDto : MessageAnswerDto) {
    return this.questionService.updateSumAnswers(msgDto)
  }

  //@UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionService.create(createQuestionDto);
  }

}
