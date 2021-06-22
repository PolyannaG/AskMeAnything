import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {AnswerService} from "./answer.service";
import {CreateAnswerDto} from "./dto/create-answer.dto";

@Controller('answer')
export class AnswerController {
    constructor(private readonly answerService: AnswerService) {}

    @Post('createAnswer/:id')
    createAnswer(@Param('id') params: number, @Body() createAnswerDto: CreateAnswerDto) {
        return this.answerService.insertAnswer(params, createAnswerDto);
    }

    @Get('checkForQuestion/:id')
    checkQuestion(@Param('id') params: number) {
        return this.answerService.checkForQuestion(params)
    }

    @Get('findQuestionAnswers/:id')
    findQuestionAnswers(@Param('id') id: number) {
        return this.answerService.findQuestionAnswersQuery(id)
    }

    @Get('findAnswersForUser/:id')
    findAnswersForUser(@Param('id') id: number) {
        return this.answerService.findAnswersForUserQuery(id)
    }

    @Get('findAllDate/:date_from/:userid')
    findAllDate(@Param('date_from') date_from: Date, @Param('userid') userid : number) {
        return this.answerService.findAllDateQuery(date_from, userid)
    }
}
