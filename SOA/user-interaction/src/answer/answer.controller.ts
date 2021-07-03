import {
    Body,
    Controller,
    Get,
    Param,
    Post, Req,
    ServiceUnavailableException,
    UnauthorizedException
} from '@nestjs/common';
import {AnswerService} from "./answer.service";
import {Request} from "express";

@Controller('user_interaction/answer')
export class AnswerController {
    constructor(private readonly answerService: AnswerService) {}

    async onModuleInit(): Promise<string> {
        let subscribed = await this.answerService.Subscribe();
        if (subscribed)
            return "Subscribed successfully";
        else
            return "Something went wrong, cannot subscribe for now";
    }

    async onModuleDestroy(): Promise<string> {
        let unsubscribed = await this.answerService.unSubscribe();
        if (unsubscribed)
            return "Unsubscribed successfully";
        else
            return "Something went wrong, cannot unsubscribe for now";
    }

    //@UseGuards(JwtAuthGuard)
    @Post('/:id')
    async createAnswer(@Param('id') params: number, @Body() createAnswerDto: object, @Req() request: Request) {
        let auth = await this.answerService.auth(request);
        if (auth) {
            let cookieUserId = await this.answerService.cookieUserId(request);
            if (cookieUserId == createAnswerDto["userId"]) {
                return this.answerService.create(params, createAnswerDto);
            }
            else //userId of url != userId of token so unauthorized to create an answer as another user
                throw new UnauthorizedException()
        }
        else if (auth === false)
            throw new UnauthorizedException()
        else
            throw new ServiceUnavailableException()
    }

    @Get('for_question/:id')
    findQuestionAnswers(@Param('id') id: number) {
        return this.answerService.findQuestionAnswers(id)
    }

    //@UseGuards(JwtAuthGuard)
    @Get('for_user/:id')
    async findAnswersForUser(@Param('id') id: number, @Req() request: Request) {
        let auth = await this.answerService.auth(request);
        if (auth) {
            let cookieUserId = await this.answerService.cookieUserId(request);
            if (cookieUserId == id) {
                return this.answerService.findAnswersForUser(id)
            }
            else //userId of url != userId of token so unauthorized to create an answer as another user
                throw new UnauthorizedException()
        }
        else if (auth === false)
            throw new UnauthorizedException()
        else
            throw new ServiceUnavailableException()
    }

    //@UseGuards(JwtAuthGuard)
    @Get('all_user/:userid/:date_from')
    async findAllDate(@Param('date_from') date_from: Date, @Param('userid') userid : number, @Req() request: Request) {
        let auth = await this.answerService.auth(request);
        if (auth) {
            let cookieUserId = await this.answerService.cookieUserId(request);
            if (cookieUserId == userid) {
                return this.answerService.findAllDate(date_from, userid)
            }
            else //userId of url != userId of token so unauthorized to create an answer as another user
                throw new UnauthorizedException()
        }
        else if (auth === false)
            throw new UnauthorizedException()
        else
            throw new ServiceUnavailableException()
    }

}
