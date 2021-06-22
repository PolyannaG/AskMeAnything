import {Body, Controller, Get, Param, Post, Req, UseGuards} from '@nestjs/common';
import {QuestionService} from "./question.service";
import {JwtAuthGuard} from "./jwt-auth.guard";
import {Request} from "express";

@Controller('user_interaction/question')
export class QuestionController {
    constructor(private readonly questionService: QuestionService,
                //private readonly jwtService:
                ) {}

    async onModuleInit() {
        let subscribed = await this.questionService.Subscribe();
        if (subscribed)
            return "Subscribed successfully";
        else
            return "Something went wrong, cannot subscribe for now";
    }

    async onApplicationShutdown() {
        let unsubscribed = this.questionService.unSubscribe();
        if (unsubscribed)
            return "Unsubscribed successfully";
        else
            return "Something went wrong, cannot unsubscribe for now";
    }

    /*

    @Post('question_message')
    updateDatabase(@Body() msgDto : MessageQuestionDto) {
        return this.questionService.updateQuestionDatabases(msgDto)
    }

    @Post('answer_message')
    updateSumAnswers(@Body() msgDto : MessageAnswerDto) {
        return this.questionService.updateSumAnswers(msgDto)
    }
     */

    //@UseGuards(JwtAuthGuard)
    @Post()
    create(
        @Body() createQuestionDto: object
    ) {
        return this.questionService.create(createQuestionDto);
    }

    //@UseGuards(JwtAuthGuard)
    @Get('all/:date_from')
    findAll(@Param('date_from',) date_from: Date) {
        return this.questionService.findAll(date_from)
    }

    //@UseGuards(JwtAuthGuard)
    @Get('all_titles')
    findAllTitles() {
        return this.questionService.findAllTitles()
    }

    //@UseGuards(JwtAuthGuard)
    @Get('all_user/:date_from/:Userid')
    findAllUser(@Param('date_from') date_from: Date, @Param('Userid') Userid : number) {
        return this.questionService.findAllUser(date_from, Userid)
    }

    //@UseGuards(JwtAuthGuard)
    @Get('id/:id')
    findOne(@Param('id') id: number) {
        return this.questionService.findOne(+id)
    }

    @Get('most_popular')
    getMostPopular(){
        return this.questionService.getMostPopular()
    }

    //@UseGuards(JwtAuthGuard)
    @Get('start_end_date/:date_from/:date_to')
    filterByStartAndEndDate(@Param('date_from') date_from: Date, @Param('date_to') date_to: Date){
        return this.questionService.filterByStartAndEndDate(date_from, date_to)
    }

    //@UseGuards(JwtAuthGuard)
    @Get('start_end_date_user/:userid/:date_from/:date_to')
    filterByStartAndEndDateUser(@Param('date_from') date_from: Date, @Param('date_to') date_to: Date, @Param('userid') Userid :number){
        return this.questionService.filterByStartAndEndDateUser(date_from, date_to, Userid)
    }

    //@UseGuards(JwtAuthGuard)
    @Get('keyword_date/:keyword/:date_from')
    filterByKeywordDateFrom(@Param('keyword') keyword: String, @Param('date_from') date_from: Date){
        return this.questionService.filterByKeywordDateFrom(keyword, date_from)
    }

    //@UseGuards(JwtAuthGuard)
    @Get('keyword_date_user/:keyword/:userid/:date_from')
    filterByKeywordDateFromUser(@Param('keyword') keyword: String, @Param('date_from') date_from: Date, @Param('userid') Userid: number){
        return this.questionService.filterByKeywordDateFromUser(keyword, date_from, Userid)
    }

    //@UseGuards(JwtAuthGuard)
    @Get('keyword_date_from_to/:keyword/:date_from/:date_to')
    filterByKeywordDateFromTo(@Param('keyword') keyword: String, @Param('date_from', ) date_from: Date,  @Param('date_to', ) date_to: Date){
        return this.questionService.filterByKeywordDateFromTo(keyword, date_from, date_to)
    }

    //@UseGuards(JwtAuthGuard)
    @Get('keyword_date_from_to_user/:keyword/:userid/:date_from/:date_to')
    filterByKeywordDateFromToUser(@Param('keyword') keyword: String, @Param('date_from') date_from: Date,  @Param('date_to', ) date_to: Date, @Param('userid') Userid: number){
        return this.questionService.filterByKeywordDateFromToUser(keyword, date_from, date_to, Userid)
    }

    //@UseGuards(JwtAuthGuard)
    @Get('all_keywords')
    findAllKeywords(){
        return this.questionService.findAllKeywords()
    }

    //@UseGuards(JwtAuthGuard)
    @Get('specific_keywords/:keyword')
    findSpecificKeywords(@Param('keyword') keyword: String){
        return this.questionService.findSpecificKeywords(keyword)
    }
}
