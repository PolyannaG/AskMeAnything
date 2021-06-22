import {Body, Controller, Get, Param, Post, Req, UnauthorizedException, UseGuards} from '@nestjs/common';
import {StatsService} from "./stats.service";
import {Request} from "express";
import {JwtAuthGuard} from "./jwt-auth.guard";

@Controller('stats')
export class StatsController {
    constructor(private readonly statsService: StatsService) {}

    async onModuleInit() {
        let subscribed = await this.statsService.Subscribe();
        if (subscribed)
            return "Subscribed successfully";
        else
            return "Something went wrong, cannot subscribe for now";
    }

    async onApplicationShutdown() {
        let unsubscribed = this.statsService.unSubscribe();
        if (unsubscribed)
            return "Unsubscribed successfully";
        else
            return "Something went wrong, cannot unsubscribe for now";
    }

    @Get('keywords')
    findByKeywords() {
        return this.statsService.findByKeywords()
    }

    //@UseGuards(JwtAuthGuard)
    @Get('keywords_user/:Userid')
    async findByKeywordsUser(@Param('Userid') Userid : number, @Req() request: Request)  {
        let auth = await this.statsService.auth(request);
        if (auth)
            return this.statsService.findByKeywordsUser(Userid)
        else
            throw new UnauthorizedException()
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
