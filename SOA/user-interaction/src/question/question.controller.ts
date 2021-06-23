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
import {QuestionService} from "./question.service";
import {Request} from "express";

@Controller('user_interaction/question')
export class QuestionController {
    constructor(private readonly questionService: QuestionService,
                //private readonly jwtService:
                ) {}

    async onModuleInit(): Promise<string> {
        let subscribed = await this.questionService.Subscribe();
        if (subscribed)
            return "Subscribed successfully";
        else
            return "Something went wrong, cannot subscribe for now";
    }

    async onModuleDestroy(): Promise<string> {
        let unsubscribed = await this.questionService.unSubscribe();
        if (unsubscribed)
            return "Unsubscribed successfully";
        else
            return "Something went wrong, cannot unsubscribe for now";
    }

    //@UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() createQuestionDto: object, @Req() request: Request) {
        let auth = await this.questionService.auth(request);
        if (auth)
            return this.questionService.create(createQuestionDto);
        else if (auth === false)
            throw new UnauthorizedException()
        else
            throw new ServiceUnavailableException()
    }

    //@UseGuards(JwtAuthGuard)
    @Get('all/:date_from')
    async findAll(@Param('date_from',) date_from: Date, @Req() request: Request) {
        let auth = await this.questionService.auth(request);
        if (auth)
            return this.questionService.findAll(date_from)
        else if (auth === false)
            throw new UnauthorizedException()
        else
            throw new ServiceUnavailableException()
    }

    //@UseGuards(JwtAuthGuard)
    @Get('all_titles')
    async findAllTitles(@Req() request: Request) {
        let auth = await this.questionService.auth(request);
        if (auth)
            return this.questionService.findAllTitles()
        else if (auth === false)
            throw new UnauthorizedException()
        else
            throw new ServiceUnavailableException()
    }

    //@UseGuards(JwtAuthGuard)
    @Get('all_user/:date_from/:Userid')
    async findAllUser(@Param('date_from') date_from: Date, @Param('Userid') Userid : number, @Req() request: Request) {
        let auth = await this.questionService.auth(request);
        if (auth)
            return this.questionService.findAllUser(date_from, Userid)
        else if (auth === false)
            throw new UnauthorizedException()
        else
            throw new ServiceUnavailableException()
    }

    //@UseGuards(JwtAuthGuard)
    @Get('id/:id')
    async findOne(@Param('id') id: number, @Req() request: Request) {
        let auth = await this.questionService.auth(request);
        if (auth)
            return this.questionService.findOne(+id)
        else if (auth === false)
            throw new UnauthorizedException()
        else
            throw new ServiceUnavailableException()
    }

    @Get('most_popular')
    getMostPopular(){
        return this.questionService.getMostPopular()
    }

    //@UseGuards(JwtAuthGuard)
    @Get('start_end_date/:date_from/:date_to')
    async filterByStartAndEndDate(@Param('date_from') date_from: Date, @Param('date_to') date_to: Date, @Req() request: Request){
        let auth = await this.questionService.auth(request);
        if (auth)
            return this.questionService.filterByStartAndEndDate(date_from, date_to)
        else if (auth === false)
            throw new UnauthorizedException()
        else
            throw new ServiceUnavailableException()
    }

    //@UseGuards(JwtAuthGuard)
    @Get('start_end_date_user/:userid/:date_from/:date_to')
    async filterByStartAndEndDateUser(@Param('date_from') date_from: Date, @Param('date_to') date_to: Date, @Param('userid') Userid :number, @Req() request: Request){
        let auth = await this.questionService.auth(request);
        if (auth)
            return this.questionService.filterByStartAndEndDateUser(date_from, date_to, Userid)
        else if (auth === false)
            throw new UnauthorizedException()
        else
            throw new ServiceUnavailableException()
    }

    //@UseGuards(JwtAuthGuard)
    @Get('keyword_date/:keyword/:date_from')
    async  filterByKeywordDateFrom(@Param('keyword') keyword: String, @Param('date_from') date_from: Date, @Req() request: Request){
        let auth = await this.questionService.auth(request);
        if (auth)
            return this.questionService.filterByKeywordDateFrom(keyword, date_from)
        else if (auth === false)
            throw new UnauthorizedException()
        else
            throw new ServiceUnavailableException()
    }

    //@UseGuards(JwtAuthGuard)
    @Get('keyword_date_user/:keyword/:userid/:date_from')
    async filterByKeywordDateFromUser(@Param('keyword') keyword: String, @Param('date_from') date_from: Date, @Param('userid') Userid: number, @Req() request: Request){
        let auth = await this.questionService.auth(request);
        if (auth)
            return this.questionService.filterByKeywordDateFromUser(keyword, date_from, Userid)
        else if (auth === false)
            throw new UnauthorizedException()
        else
            throw new ServiceUnavailableException()
    }

    //@UseGuards(JwtAuthGuard)
    @Get('keyword_date_from_to/:keyword/:date_from/:date_to')
    async filterByKeywordDateFromTo(@Param('keyword') keyword: String, @Param('date_from', ) date_from: Date,  @Param('date_to', ) date_to: Date, @Req() request: Request){
        let auth = await this.questionService.auth(request);
        if (auth)
            return this.questionService.filterByKeywordDateFromTo(keyword, date_from, date_to)
        else if (auth === false)
            throw new UnauthorizedException()
        else
            throw new ServiceUnavailableException()
    }

    //@UseGuards(JwtAuthGuard)
    @Get('keyword_date_from_to_user/:keyword/:userid/:date_from/:date_to')
    async filterByKeywordDateFromToUser(@Param('keyword') keyword: String, @Param('date_from') date_from: Date,  @Param('date_to', ) date_to: Date, @Param('userid') Userid: number, @Req() request: Request){
        let auth = await this.questionService.auth(request);
        if (auth)
            return this.questionService.filterByKeywordDateFromToUser(keyword, date_from, date_to, Userid)
        else if (auth === false)
            throw new UnauthorizedException()
        else
            throw new ServiceUnavailableException()
    }

    //@UseGuards(JwtAuthGuard)
    @Get('all_keywords')
    async findAllKeywords(@Req() request: Request){
        let auth = await this.questionService.auth(request);
        if (auth)
            return this.questionService.findAllKeywords()
        else if (auth === false)
            throw new UnauthorizedException()
        else
            throw new ServiceUnavailableException()
    }

    //@UseGuards(JwtAuthGuard)
    @Get('specific_keywords/:keyword')
    async findSpecificKeywords(@Param('keyword') keyword: String, @Req() request: Request){
        let auth = await this.questionService.auth(request);
        if (auth)
            return this.questionService.findSpecificKeywords(keyword)
        else if (auth === false)
            throw new UnauthorizedException()
        else
            throw new ServiceUnavailableException()
    }
}
