import {Body, Controller, Get, Param, Post, UseGuards} from '@nestjs/common';
import {AnswerService} from "./answer.service";
import {JwtAuthGuard} from "./jwt-auth.guard";

@Controller('user_interaction/answer')
export class AnswerController {
    constructor(private readonly answerService: AnswerService) {}

    async onModuleInit() {
        let subscribed = await this.answerService.Subscribe();
        if (subscribed)
            return "Subscribed successfully";
        else
            return "Something went wrong, cannot subscribe for now";
    }

    async onApplicationShutdown() {
        let unsubscribed = this.answerService.unSubscribe();
        if (unsubscribed)
            return "Unsubscribed successfully";
        else
            return "Something went wrong, cannot unsubscribe for now";
    }

    //@UseGuards(JwtAuthGuard)
    @Post('/:id')
    createAnswer(@Param('id') params: number, @Body() createAnswerDto: object) {
        return this.answerService.create(params, createAnswerDto);
    }

    @Get('for_question/:id')
    findQuestionAnswers(@Param('id') id: number) {
        return this.answerService.findQuestionAnswers(id)
    }

    //@UseGuards(JwtAuthGuard)
    @Get('for_user/:id')
    findAnswersForUser(@Param('id') id: number) {
        return this.answerService.findAnswersForUser(id)
    }

    //@UseGuards(JwtAuthGuard)
    @Get('all_user/:userid/:date_from')
    findAllDate(@Param('date_from') date_from: Date, @Param('userid') userid : number) {
        return this.answerService.findAllDate(date_from, userid)
    }

}
