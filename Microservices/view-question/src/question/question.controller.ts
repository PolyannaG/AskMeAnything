import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Controller('view_question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  /*
  @Post()
  create(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionService.create(createQuestionDto);
  }
  */
  @Get('all/:date_from')
  findAll(@Param('date_from') date_from: Date) {
    return this.questionService.findAll(date_from);
  }

  @Get('id/:id')
  findOne(@Param('id') id: string) {
    return this.questionService.findOne(+id);
  }
  /*
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto) {
    return this.questionService.update(+id, updateQuestionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionService.remove(+id);
  }
   */



  @Get('keywords')
  findByKeywords(){
    return this.questionService.findByKeywords();
  }

  @Get('keywords_user/:Userid')
  findByKeywordsUser(@Param('Userid') Userid : number){
    return this.questionService.findByKeywordsUser(Userid);
  }




}
