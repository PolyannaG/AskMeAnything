import {HttpService, Injectable, NotFoundException} from '@nestjs/common';
import {map} from "rxjs/operators";


@Injectable()
export class QuestionService {

    constructor(private httpService: HttpService,
                //private redisService: RedisService
    ) {}

    async create(createQuestionDto: object) : Promise<Object[]>{
        let created_question = await this.httpService.post("http://localhost:8006/question/create", {body: createQuestionDto})
            .pipe(map(response => response.data))
            .toPromise();
        return created_question
    }

    async findAll(date_from: Date): Promise<Object[]> {
        const questions = await this.httpService.get("http://localhost:8006/question/findAll",
                                                    {params:
                                                            {
                                                                "date_from": date_from
                                                            }
                                                    })
            .pipe(map(response => response.data))
            .toPromise();

        if (!questions || questions.length == 0)
            throw new NotFoundException(`No questions earlier than date ${date_from} found.`)
        return questions
    }

    async findAllTitles(): Promise<Object[]> {
        const titles = await this.httpService.get("http://localhost:8006/question/findAllTitles")
            .pipe(map(response => response.data))
            .toPromise();

        if (!titles || titles.length == 0)
            throw new NotFoundException(`No questions earlier found.`)
        return titles
    }

    async findAllUser(date_from: Date, Userid: number): Promise<Object[]> {
        const questions = await this.httpService.get("http://localhost:8006/question/findAllUser",
                                                    {params:
                                                            {
                                                                "date_from": date_from,
                                                                "Userid": Userid
                                                            }
                                                    })
            .pipe(map(response => response.data))
            .toPromise();

        if (!questions || questions.length == 0)
            throw new NotFoundException(`No questions earlier than date ${date_from} for user with id ${Userid} found.`)
        return questions
    }

    async findOne(id: number): Promise<Object[]> {
        const question = await this.httpService.get("http://localhost:8006/question/findOne",
            {params:
                    {
                        "id": id
                    }
            })
            .pipe(map(response => response.data))
            .toPromise();

        if (!question)
            throw new NotFoundException(`Question with id ${id} not found.`)
        return [question]
    }

    async getMostPopular(): Promise<Object[]> {
        const questions = await this.httpService.get("http://localhost:8006/question/getMostPopular")
            .pipe(map(response => response.data))
            .toPromise();

        if (!questions)
            throw new NotFoundException('No questions found')
        return questions
    }

    async filterByStartAndEndDate(date_from: Date, date_to: Date): Promise<Object[]> {
        const questions = await this.httpService.get("http://localhost:8006/question/filterByStartAndEndDate",
                                                    {params:
                                                            {
                                                                "date_from": date_from,
                                                                "date_to": date_to
                                                            }
                                                    })
            .pipe(map(response => response.data))
            .toPromise();

        if (!questions || questions.length == 0)
            throw new NotFoundException(`No questions earlier than date ${date_from} and later than date ${date_to} found.`)

        for (let i = 0; i < questions.length; i++) {
            let keyw = await this.httpService.get("http://localhost:8006/question/findOne",
                                                {params:
                                                        {
                                                            "id": questions[i].id
                                                        }
                                                })
                .pipe(map(response => response.data))
                .toPromise();

            //let keyw = await this.manager.findOne(Question, questions[i].id, {relations: ["keywords"]})
            questions[i].keywords = keyw.keywords
        }
        return questions
    }

    async filterByStartAndEndDateUser(date_from: Date, date_to: Date, Userid : number): Promise<Object[]> {
        const questions = await this.httpService.get("http://localhost:8006/question/filterByStartAndEndDateUser",
                                                    {params:
                                                            {
                                                                "date_from": date_from,
                                                                "date_to": date_to,
                                                                "Userid": Userid
                                                            }
                                                    })
            .pipe(map(response => response.data))
            .toPromise();

        if (!questions || questions.length == 0)
            throw new NotFoundException(`No questions earlier than date ${date_from} and later than date ${date_to} and user id ${Userid} found .`)

        for (let i = 0; i < questions.length; i++) {
            let keyw = await this.httpService.get("http://localhost:8006/question/findOne",
                {params:
                        {
                            "id": questions[i].id
                        }
                })
                .pipe(map(response => response.data))
                .toPromise();

            //let keyw = await this.manager.findOne(Question, questions[i].id, {relations: ["keywords"]})
            questions[i].keywords = keyw.keywords
        }
        return questions
    }

    async filterByKeywordDateFrom(keyword: String, date_from: Date): Promise<Object[]> {
        const quest= await this.httpService.get("http://localhost:8006/question/filterByKeywordDateFrom",
                                                {params:
                                                        {
                                                            "date_from": date_from,
                                                            "keyword": keyword
                                                        }
                                                })
            .pipe(map(response => response.data))
            .toPromise();

        if (!quest || !quest.length)
            throw new NotFoundException(`No questions found for keyword ${keyword} and before ${date_from}.`)

        for (let i = 0; i < quest.length; i++) {
            let keyw = await this.httpService.get("http://localhost:8006/question/findOne",
                {params:
                        {
                            "id": quest[i].id
                        }
                })
                .pipe(map(response => response.data))
                .toPromise();

            //let keyw = await this.manager.findOne(Question, quest[i].id, {relations: ["keywords"]})
            quest[i].keywords = keyw.keywords
        }

        return quest
    }

    async filterByKeywordDateFromUser(keyword: String, date_from: Date, Userid : number): Promise<Object[]> {
        const quest= await this.httpService.get("http://localhost:8006/question/filterByKeywordDateFromUser",
                                                {params:
                                                        {
                                                            "date_from": date_from,
                                                            "keyword": keyword,
                                                            "Userid": Userid
                                                        }
                                                })
            .pipe(map(response => response.data))
            .toPromise();

        if (!quest || !quest.length)
            throw new NotFoundException(`No questions found for keyword ${keyword} and before ${date_from} and user id ${Userid}.`)

        for (let i = 0; i < quest.length; i++) {
            let keyw = await this.httpService.get("http://localhost:8006/question/findOne",
                {params:
                        {
                            "id": quest[i].id
                        }
                })
                .pipe(map(response => response.data))
                .toPromise();

            //let keyw = await this.manager.findOne(Question, quest[i].id, {relations: ["keywords"]})
            quest[i].keywords = keyw.keywords
        }

        return quest
    }

    async filterByKeywordDateFromTo(keyword: String, date_from: Date, date_to : Date): Promise<Object[]> {
        const quest= await this.httpService.get("http://localhost:8006/question/filterByKeywordDateFromTo",
                                                {params:
                                                        {
                                                            "date_from": date_from,
                                                            "keyword": keyword,
                                                            "date_to": date_to
                                                        }
                                                })
            .pipe(map(response => response.data))
            .toPromise();

        if (!quest || !quest.length)
            throw new NotFoundException(`No questions found for keyword ${keyword} and before ${date_from} and after ${date_to}.`)

        for (let i = 0; i < quest.length; i++) {
            let keyw = await this.httpService.get("http://localhost:8006/question/findOne",
                {params:
                        {
                            "id": quest[i].id
                        }
                })
                .pipe(map(response => response.data))
                .toPromise();

            //let keyw = await this.manager.findOne(Question, quest[i].id, {relations: ["keywords"]})
            quest[i].keywords = keyw.keywords
        }

        return quest
    }

    async filterByKeywordDateFromToUser(keyword: String, date_from: Date,  date_to : Date, Userid : number): Promise<Object[]> {
        const quest= await this.httpService.get("http://localhost:8006/question/filterByKeywordDateFromToUser",
                                                {params:
                                                        {
                                                            "date_from": date_from,
                                                            "keyword": keyword,
                                                            "date_to": date_to,
                                                            "Userid": Userid
                                                        }
                                                })
            .pipe(map(response => response.data))
            .toPromise();

        if (!quest || !quest.length)
            throw new NotFoundException(`No questions found for keyword ${keyword} and before ${date_from} and after ${date_to} and user id ${Userid}.`)

        for (let i = 0; i < quest.length; i++) {
            let keyw = await this.httpService.get("http://localhost:8006/question/findOne",
                {params:
                        {
                            "id": quest[i].id
                        }
                })
                .pipe(map(response => response.data))
                .toPromise();

            //let keyw = await this.manager.findOne(Question, quest[i].id, {relations: ["keywords"]})
            quest[i].keywords = keyw.keywords
        }

        return quest
    }

    async findAllKeywords(): Promise<Object[]>{
        const keyw = await this.httpService.get("http://localhost:8006/question/findAllKeywords")
            .pipe(map(response => response.data))
            .toPromise();

        if (!keyw || !keyw.length)
            throw new NotFoundException(`No keywords found.`)
        return keyw

    }

    async findSpecificKeywords(keyword: String): Promise<Object[]>{
        const keyw = await this.httpService.get("http://localhost:8006/question/findSpecificKeywords",
                                                {params:
                                                        {
                                                            "keyword": keyword,
                                                        }
                                                })
            .pipe(map(response => response.data))
            .toPromise();

        if (!keyw || !keyw.length)
            throw new NotFoundException(`No keywords found.`)
        return keyw

    }


}
