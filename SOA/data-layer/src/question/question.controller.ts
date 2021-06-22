import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {QuestionService} from "./question.service";
import {CreateQuestionDto} from "./dto/create-question.dto";

@Controller('question')
export class QuestionController {
    constructor(private readonly questionService: QuestionService,
                //private readonly jwtService:
    ) {}

    @Post('create')
    create(@Body() createQuestionDto: CreateQuestionDto) {
        return this.questionService.insertQuery(createQuestionDto);
    }

    @Get('findAll')
    findAll(@Param('date_from',) date_from: Date) {
        return this.questionService.findAllQuery(date_from)
    }

    @Get('findAllTitles')
    findAllTitles() {
        return this.questionService.findAllTitlesQuery()
    }

    @Get('findAllUser')
    findAllUser(@Param('date_from') date_from: Date, @Param('Userid') Userid : number) {
        return this.questionService.findAllUserQuery(date_from, Userid)
    }

    @Get('findOne')
    findOne(@Param('id') id: number) {
        return this.questionService.findOneQuery(+id)
    }

    @Get('getMostPopular')
    getMostPopular(){
        return this.questionService.getMostPopularQuery()
    }

    @Get('filterByStartAndEndDate')
    filterByStartAndEndDate(@Param('date_from') date_from: Date, @Param('date_to') date_to: Date){
        return this.questionService.filterByStartAndEndDateQuery(date_from, date_to)
    }

    @Get('filterByStartAndEndDateUser')
    filterByStartAndEndDateUser(@Param('date_from') date_from: Date, @Param('date_to') date_to: Date, @Param('userid') Userid :number){
        return this.questionService.filterByStartAndEndDateUserQuery(date_from, date_to, Userid)
    }

    @Get('filterByKeywordDateFrom')
    filterByKeywordDateFrom(@Param('keyword') keyword: String, @Param('date_from') date_from: Date){
        return this.questionService.filterByKeywordDateFromQuery(keyword, date_from)
    }

    @Get('filterByKeywordDateFromUser')
    filterByKeywordDateFromUser(@Param('keyword') keyword: String, @Param('date_from') date_from: Date, @Param('userid') Userid: number){
        return this.questionService.filterByKeywordDateFromUserQuery(keyword, date_from, Userid)
    }

    @Get('filterByKeywordDateFromTo')
    filterByKeywordDateFromTo(@Param('keyword') keyword: String, @Param('date_from', ) date_from: Date,  @Param('date_to', ) date_to: Date){
        return this.questionService.filterByKeywordDateFromToQuery(keyword, date_from, date_to)
    }

    @Get('filterByKeywordDateFromToUser')
    filterByKeywordDateFromToUser(@Param('keyword') keyword: String, @Param('date_from') date_from: Date,  @Param('date_to', ) date_to: Date, @Param('userid') Userid: number){
        return this.questionService.filterByKeywordDateFromToUserQuery(keyword, date_from, date_to, Userid)
    }

    @Get('findAllKeywords')
    findAllKeywords(){
        return this.questionService.findAllKeywordsQuery()
    }

    @Get('findSpecificKeywords')
    findSpecificKeywords(@Param('keyword') keyword: String){
        return this.questionService.findSpecificKeywordsQuery(keyword)
    }
}
