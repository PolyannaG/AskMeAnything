import {HttpService, Injectable, NotFoundException} from '@nestjs/common';
import {catchError, map} from "rxjs/operators";
import {RedisService} from "nestjs-redis";


@Injectable()
export class QuestionService {

    private client: any;
    constructor(private httpService: HttpService,
                private redisService: RedisService) {
        this.getClient();
    }
    private async getClient() {
        this.client = await this.redisService.getClient();
    }

    async Subscribe(): Promise<boolean> {
        let body = {
            name : "Questions",
            address : "http://localhost:8009/user_interaction/question",
            description : "Creates questions and fetches answers with various filter combinations (dates, keywords)",
            services : []
        };

        let req =this.httpService.post("http://localhost:8010/management/subscribe", body);

        req.pipe(catchError(async e => {
            let unsub = await this.client.hget('lost', 'unregistrations');
            let sub = await this.client.hget('lost', 'registrations');
            let lost_registrations = JSON.parse(sub);
            let lost_unregistrations = JSON.parse(unsub);
            let newUnsub = [];

            if (lost_unregistrations != null) {
                for (let j = 0; j < lost_unregistrations.length; j++) {
                    if (lost_unregistrations[j]["address"] != body["address"])
                        newUnsub.push(lost_unregistrations[j]);
                }

                await this.client.hset('lost', 'unregistrations', JSON.stringify(newUnsub));
            }

            if (lost_registrations == null) {
                lost_registrations = [];
                lost_registrations[0] = body;
            }
            else {
                lost_registrations.push(body);
            }

            await this.client.hset('lost', 'registrations', JSON.stringify(lost_registrations));
            return false;
        }));

        return req.pipe(map(response => response.data)).toPromise();
    }

    async unSubscribe(): Promise<any> {
        let body = {
            name : "Questions",
            address : "http://localhost:8009/user_interaction/question",
            description : "Creates questions and fetches answers with various filter combinations (dates, keywords)",
            services : []
        };

        let req = this.httpService.post("http://localhost:8010/management/unsubscribe", body);

        req.pipe(catchError(async e => {
            let unsub = await this.client.hget('lost', 'unregistrations');
            let sub = await this.client.hget('lost', 'registrations');
            let lost_registrations = JSON.parse(sub);
            let lost_unregistrations = JSON.parse(unsub);
            let newSub = [];

            if (lost_registrations != null) {
                for (let j = 0; j < lost_registrations.length; j++) {
                    if (lost_registrations[j]["address"] != body["address"])
                        newSub.push(lost_registrations[j]);
                }

                await this.client.hset('lost', 'registrations', JSON.stringify(newSub));
            }

            if (lost_unregistrations == null) {
                lost_unregistrations = [];
                lost_unregistrations[0] = body;
            }
            else {
                lost_unregistrations.push(body);
            }

            await this.client.hset('lost', 'unregistrations', JSON.stringify(lost_unregistrations));
            return false;
        }));

        return req.pipe(map(response => response.data)).toPromise();
    }

    async create(createQuestionDto: object) : Promise<Object>{
        let created_question = await this.httpService.post("http://localhost:8006/question/create", createQuestionDto)
            .pipe(map(response => response.data))
            .toPromise();
        return created_question
    }

    async findAll(date_from: Date): Promise<Object[]> {
        const questions = await this.httpService.get("http://localhost:8006/question/findAll/"+date_from)
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
        const questions = await this.httpService.get("http://localhost:8006/question/findAllUser/"+date_from+"/"+Userid)
            .pipe(map(response => response.data))
            .toPromise();

        if (!questions || questions.length == 0)
            throw new NotFoundException(`No questions earlier than date ${date_from} for user with id ${Userid} found.`)
        return questions
    }

    async findOne(id: number): Promise<Object[]> {
        const question = await this.httpService.get("http://localhost:8006/question/findOne/"+id)
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
        const questions = await this.httpService.get("http://localhost:8006/question/filterByStartAndEndDate/"+date_from+"/"+date_to)
            .pipe(map(response => response.data))
            .toPromise();

        if (!questions || questions.length == 0)
            throw new NotFoundException(`No questions earlier than date ${date_from} and later than date ${date_to} found.`)

        for (let i = 0; i < questions.length; i++) {
            let keyw = await this.httpService.get("http://localhost:8006/question/findOne/"+questions[i].id)
                .pipe(map(response => response.data))
                .toPromise();

            //let keyw = await this.manager.findOne(Question, questions[i].id, {relations: ["keywords"]})
            questions[i].keywords = keyw.keywords
        }
        return questions
    }

    async filterByStartAndEndDateUser(date_from: Date, date_to: Date, Userid : number): Promise<Object[]> {
        const questions = await this.httpService.get("http://localhost:8006/question/filterByStartAndEndDateUser/"+date_from+"/"+date_to+"/"+Userid)
            .pipe(map(response => response.data))
            .toPromise();

        if (!questions || questions.length == 0)
            throw new NotFoundException(`No questions earlier than date ${date_from} and later than date ${date_to} and user id ${Userid} found .`)

        for (let i = 0; i < questions.length; i++) {
            let keyw = await this.httpService.get("http://localhost:8006/question/findOne/"+questions[i].id)
                .pipe(map(response => response.data))
                .toPromise();

            //let keyw = await this.manager.findOne(Question, questions[i].id, {relations: ["keywords"]})
            questions[i].keywords = keyw.keywords
        }
        return questions
    }

    async filterByKeywordDateFrom(keyword: String, date_from: Date): Promise<Object[]> {
        const quest= await this.httpService.get("http://localhost:8006/question/filterByKeywordDateFrom/"+keyword+"/"+date_from)
            .pipe(map(response => response.data))
            .toPromise();

        if (!quest || !quest.length)
            throw new NotFoundException(`No questions found for keyword ${keyword} and before ${date_from}.`)

        for (let i = 0; i < quest.length; i++) {
            let keyw = await this.httpService.get("http://localhost:8006/question/findOne/"+quest[i].id)
                .pipe(map(response => response.data))
                .toPromise();

            //let keyw = await this.manager.findOne(Question, quest[i].id, {relations: ["keywords"]})
            quest[i].keywords = keyw.keywords
        }

        return quest
    }

    async filterByKeywordDateFromUser(keyword: String, date_from: Date, Userid : number): Promise<Object[]> {
        const quest= await this.httpService.get("http://localhost:8006/question/filterByKeywordDateFromUser/"+keyword+"/"+date_from+"/"+Userid)
            .pipe(map(response => response.data))
            .toPromise();

        if (!quest || !quest.length)
            throw new NotFoundException(`No questions found for keyword ${keyword} and before ${date_from} and user id ${Userid}.`)

        for (let i = 0; i < quest.length; i++) {
            let keyw = await this.httpService.get("http://localhost:8006/question/findOne/"+quest[i].id)
                .pipe(map(response => response.data))
                .toPromise();

            //let keyw = await this.manager.findOne(Question, quest[i].id, {relations: ["keywords"]})
            quest[i].keywords = keyw.keywords
        }

        return quest
    }

    async filterByKeywordDateFromTo(keyword: String, date_from: Date, date_to : Date): Promise<Object[]> {
        const quest= await this.httpService.get("http://localhost:8006/question/filterByKeywordDateFromTo/"+keyword+"/"+date_from+"/"+date_to)
            .pipe(map(response => response.data))
            .toPromise();

        if (!quest || !quest.length)
            throw new NotFoundException(`No questions found for keyword ${keyword} and before ${date_from} and after ${date_to}.`)

        for (let i = 0; i < quest.length; i++) {
            let keyw = await this.httpService.get("http://localhost:8006/question/findOne/"+quest[i].id)
                .pipe(map(response => response.data))
                .toPromise();

            //let keyw = await this.manager.findOne(Question, quest[i].id, {relations: ["keywords"]})
            quest[i].keywords = keyw.keywords
        }

        return quest
    }

    async filterByKeywordDateFromToUser(keyword: String, date_from: Date,  date_to : Date, Userid : number): Promise<Object[]> {
        const quest= await this.httpService.get("http://localhost:8006/question/filterByKeywordDateFromToUser/"+keyword+"/"+date_from+"/"+date_to+"/"+Userid)
            .pipe(map(response => response.data))
            .toPromise();

        if (!quest || !quest.length)
            throw new NotFoundException(`No questions found for keyword ${keyword} and before ${date_from} and after ${date_to} and user id ${Userid}.`)

        for (let i = 0; i < quest.length; i++) {
            let keyw = await this.httpService.get("http://localhost:8006/question/findOne/"+quest[i].id)
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
        const keyw = await this.httpService.get("http://localhost:8006/question/findSpecificKeywords/"+keyword)
            .pipe(map(response => response.data))
            .toPromise();

        if (!keyw || !keyw.length)
            throw new NotFoundException(`No keywords found.`)
        return keyw

    }


}
