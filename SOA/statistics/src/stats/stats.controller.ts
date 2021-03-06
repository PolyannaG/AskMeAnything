import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Req,
    ServiceUnavailableException,
    UnauthorizedException
} from '@nestjs/common';
import {StatsService} from "./stats.service";
import {Request} from "express";

@Controller('stats')
export class StatsController {
    constructor(private readonly statsService: StatsService) {}

    async onModuleInit(): Promise<string> {
        let subscribed = await this.statsService.Subscribe();
        if (subscribed)
            return "Subscribed successfully";
        else
            return "Something went wrong, cannot subscribe for now";
    }

    async onModuleDestroy() : Promise<string> {
        let unsubscribed = await this.statsService.unSubscribe();
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
        if (auth) {
            let cookieUserId = await this.statsService.cookieUserId(request);
            if (cookieUserId == Userid) {
                return this.statsService.findByKeywordsUser(Userid)
            }
            else //(userId of url) != (userId of token) so unauthorized to create a question as another user
                throw new UnauthorizedException()
        }
        else if (auth === false)
            throw new UnauthorizedException()
        else
            throw new ServiceUnavailableException()
    }

    @Get('per_day/questions')
    showQuestionsPerDay(){
        return this.statsService.showQuestionsPerDay()
    }

    //@UseGuards(JwtAuthGuard)
    @Get('per_day_user/questions/:Userid')
    async showQuestionsPerDayUser(@Param('Userid') Userid : number, @Req() request: Request){
        let auth = await this.statsService.auth(request);
        if (auth) {
            let cookieUserId = await this.statsService.cookieUserId(request);
            if (cookieUserId == Userid) {
                return this.statsService.showQuestionsPerDayUser(Userid)
            }
            else //(userId of url) != (userId of token) so unauthorized to create a question as another user
                throw new UnauthorizedException()
        }
        else if (auth === false)
            throw new UnauthorizedException()
        else
            throw new ServiceUnavailableException()
    }


    @Get('per_day/answers')
    async showAnswersPerDay(@Req() request: Request){
        return this.statsService.showAnswersPerDay()
    }

    //@UseGuards(JwtAuthGuard)
    @Get('per_day_user/answers/:Userid')
    async showAnswersPerDayUser(@Param('Userid') Userid : number, @Req() request: Request){
        let auth = await this.statsService.auth(request);
        if (auth) {
            let cookieUserId = await this.statsService.cookieUserId(request);
            if (cookieUserId == Userid) {
                return this.statsService.showAnswersPerDayUser(Userid)
            }
            else //(userId of url) != (userId of token) so unauthorized to create a question as another user
                throw new UnauthorizedException()
        }
        else if (auth === false)
            throw new UnauthorizedException()
        else
            throw new ServiceUnavailableException()
    }

    //@UseGuards(JwtAuthGuard)
    @Get('count_answers_user/:Userid')
    async countAnswersUser(@Param('Userid') Userid : number, @Req() request: Request){
        let auth = await this.statsService.auth(request);
        if (auth) {
            let cookieUserId = await this.statsService.cookieUserId(request);
            if (cookieUserId == Userid) {
                return this.statsService.countAnswersUser(Userid)
            }
            else //(userId of url) != (userId of token) so unauthorized to create a question as another user
                throw new UnauthorizedException()
        }
        else if (auth === false)
            throw new UnauthorizedException()
        else
            throw new ServiceUnavailableException()
    }

    //@UseGuards(JwtAuthGuard)
    @Get('count_questions_user/:Userid')
    async countQuestionsUser(@Param('Userid') Userid : number, @Req() request: Request){
        let auth = await this.statsService.auth(request);
        if (auth) {
            let cookieUserId = await this.statsService.cookieUserId(request);
            if (cookieUserId == Userid) {
                return this.statsService.countQuestionsUser(Userid)
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
