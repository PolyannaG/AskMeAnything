import {Controller, Get, Param, Post, UseGuards} from '@nestjs/common';
import {StatsService} from "./stats.service";
import {JwtAuthGuard} from "./jwt-auth.guard";

@Controller('stats')
export class StatsController {
    constructor(private readonly statsService: StatsService) {}


    async onApplicationShutdown() {
        console.log("SHUT DOWN"); // e.g. "SIGINT"
    }



    /*
    async onModuleInit() {
        await this.statsService.subscribeAnswers();
        await this.statsService.subscribeQuestions();
        await this.statsService.retrieveLostAnswerMessages();
        await this.statsService.retrieveLostQuestionMessages();
        return "Subscribed and retrieved messages successfully";
    }



    @Post('answer_message')
    updateAnswers(@Body() msgAnswerDto : MessageAnswerDto) {
        return this.statsService.updateAnswersDatabase(msgAnswerDto)
    }

    @Post('question_message')
    updateQuestions(@Body() msgQuestionDto : MessageQuestionDto) {
        return this.statsService.updateQuestionDatabase(msgQuestionDto)
    }

     */


    @Get('keywords')
    findByKeywords() {
        return this.statsService.findByKeywords()
    }

    //@UseGuards(JwtAuthGuard)
    @Get('keywords_user/:Userid')
    findByKeywordsUser(@Param('Userid') Userid : number)  {
        return this.statsService.findByKeywordsUser(Userid)
    }

    @Get('per_day/questions')
    showQuestionsPerDay(){
        return this.statsService.showQuestionsPerDay()
    }

    //@UseGuards(JwtAuthGuard)
    @Get('per_day_user/questions/:Userid')
    showQuestionsPerDayUser(@Param('Userid') Userid : number){
        return this.statsService.showQuestionsPerDayUser(Userid)
    }

    //@UseGuards(JwtAuthGuard)
    @Get('per_day/answers')
    showAnswersPerDay(){
        return this.statsService.showAnswersPerDay()
    }

    //@UseGuards(JwtAuthGuard)
    @Get('per_day_user/answers/:Userid')
    showAnswersPerDayUser(@Param('Userid') Userid : number){
        return this.statsService.showAnswersPerDayUser(Userid)
    }

    //@UseGuards(JwtAuthGuard)
    @Get('count_answers_user/:Userid')
    countAnswersUser(@Param('Userid') Userid : number){
        return this.statsService.countAnswersUser(Userid)
    }

    //@UseGuards(JwtAuthGuard)
    @Get('count_questions_user/:Userid')
    countQuestionsUser(@Param('Userid') Userid : number){
        return this.statsService.countQuestionsUser(Userid)
    }

}
