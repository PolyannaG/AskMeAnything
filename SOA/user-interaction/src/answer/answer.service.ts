import {HttpService, Injectable, NotFoundException, ServiceUnavailableException} from '@nestjs/common';
import {catchError, map} from "rxjs/operators";
import {RedisService} from "nestjs-redis";
import {Request} from "express";

@Injectable()
export class AnswerService {
    private client: any;
    constructor(private httpService: HttpService,
                private redisService: RedisService) {
        this.getClient();
    }
    private async getClient() {
        this.client = await this.redisService.getClient();
    }


    async create (paramId: number, createAnswerDto: object) : Promise<Object> {
        const myQuestion = await this.httpService.get("http://localhost:8006/answer/checkForQuestion/"+paramId)
            .pipe(map(response => response.data))
            .toPromise();

        if (!myQuestion)
            throw new NotFoundException(`Question with id ${paramId} not found, so it can't be answered`);
        else {
            const created_answer = await this.httpService.post("http://localhost:8006/answer/createAnswer/"+paramId, createAnswerDto)
                .pipe(map(response => response.data))
                .toPromise();

            return created_answer
        }

    }

    async findQuestionAnswers(QuestionID : number): Promise<Object[]> {

        const question_answers = await this.httpService.get("http://localhost:8006/answer/findQuestionAnswers/"+QuestionID)
            .pipe(map(response => response.data))
            .toPromise();


        if (question_answers == [])
            return [
                {
                    id: QuestionID,
                    answers: []
                }
            ];

        else
            return [
                {
                    id: QuestionID,
                    answers: question_answers
                }
            ];
    }

    async findAnswersForUser(UserID : number): Promise<Object[]> {
        const my_answers = await this.httpService.get("http://localhost:8006/answer/findAnswersForUser/"+UserID)
            .pipe(map(response => response.data))
            .toPromise();

        if (my_answers == [])
            return [
                {
                    userID: UserID,
                    answers: []
                }
            ];

        else
            return [
                {
                    userID: UserID,
                    answers: my_answers
                }
            ];
    }

    async findAllDate(date_from: Date, userid: number): Promise<Object[]> {
        const ans = await this.httpService.get("http://localhost:8006/answer/findAllDate/"+date_from+"/"+userid)
            .pipe(map(response => response.data))
            .toPromise();

        if (!ans || ans.length == 0)
            throw new NotFoundException(`No answers found earlier than date ${date_from} found.`)
        return ans
    }


    async Subscribe(): Promise<any> {
        let body = {
            name : "Answers",
            address : "http://localhost:8009/user_interaction/answer",
            description : "Creates answers to existing questions and fetches answers per question or user",
            services : []
        };

        return await this.httpService.post("http://localhost:8010/management/subscribe", body)
            .pipe(catchError(async e => {
                let unsub = await this.client.hget('lost', 'unregisters');
                let sub = await this.client.hget('lost', 'registers');
                let lost_registrations = JSON.parse(sub);
                let lost_unregistrations = JSON.parse(unsub);
                let newUnsub = [];

                if (lost_unregistrations != null) {
                    for (let j = 0; j < lost_unregistrations.length; j++) {
                        if (lost_unregistrations[j]["address"] != body["address"])
                            newUnsub.push(lost_unregistrations[j]);
                    }

                    await this.client.hset('lost', 'unregisters', JSON.stringify(newUnsub));
                }

                if (lost_registrations == null) {
                    lost_registrations = [];
                    lost_registrations[0] = body;
                }
                else {
                    lost_registrations.push(body);
                }

                await this.client.hset('lost', 'registers', JSON.stringify(lost_registrations));
                return false;
            })).toPromise();

    }

    async unSubscribe(): Promise<any> {
        let body = {
            name : "Answers",
            address : "http://localhost:8009/user_interaction/answer",
            description : "Creates answers to existing questions and fetches answers per question or user",
            services : []
        };

        return await this.httpService.post("http://localhost:8010/management/unsubscribe", body)
            .pipe(catchError(async e => {
                let unsub = await this.client.hget('lost', 'unregisters');
                let sub = await this.client.hget('lost', 'registers');
                let lost_registrations = JSON.parse(sub);
                let lost_unregistrations = JSON.parse(unsub);
                let newSub = [];

                if (lost_registrations != null) {
                    for (let j = 0; j < lost_registrations.length; j++) {
                        if (lost_registrations[j]["address"] != body["address"])
                            newSub.push(lost_registrations[j]);
                    }

                    await this.client.hset('lost', 'registers', JSON.stringify(newSub));
                }

                if (lost_unregistrations == null) {
                    lost_unregistrations = [];
                    lost_unregistrations[0] = body;
                }
                else {
                    lost_unregistrations.push(body);
                }

                await this.client.hset('lost', 'unregisters', JSON.stringify(lost_unregistrations));
                return false;
            })).toPromise();
    }

    async auth(req : Request): Promise<boolean> {
        let services;
        try {
            services = await this.httpService.get("http://localhost:8010/discovery/services").pipe(map(response =>response.data)).toPromise();
        } catch (e) {
            services = null
        }

        if (services == null) {
            return null
            //return false
        }

        let authorization = [];
        for (let i = 0; i < services.length; i++) {
            if (services[i]["name"] == "Authorization") {
                authorization.push(services[i])
            }
        }

        if (!authorization.length) {
            return null
            //return false
        }

        const cookie = req.cookies['token'];

        let body = {
            name: authorization[0]["name"],
            url: authorization[0]["url"],
            requestMethod: authorization[0]["requestMethod"],
            params: {token: cookie}
        };

        try {
            return await this.httpService.post("http://localhost:8010/execution", body).pipe(map(response => response.data)).toPromise();
        } catch (e) {
            return null
        }
    }

    async cookieUserId(req : Request): Promise<number> {
        let services;
        try {
            services = await this.httpService.get("http://localhost:8010/discovery/services").pipe(map(response =>response.data)).toPromise();
        } catch (e) {
            services = null
        }

        if (services == null) {
            return null
            //return false
        }

        let cookieUserId = [];
        for (let i = 0; i < services.length; i++) {
            if (services[i]["name"] == "cookieUserId") {
                cookieUserId.push(services[i])
            }
        }

        if (!cookieUserId.length) {
            return null
            //return false
        }

        const cookie = req.cookies['token'];

        let body = {
            name: cookieUserId[0]["name"],
            url: cookieUserId[0]["url"],
            requestMethod: cookieUserId[0]["requestMethod"],
            params: {token: cookie}
        };

        try {
            return await this.httpService.post("http://localhost:8010/execution", body).pipe(map(response => response.data)).toPromise();
        } catch (e) {
            return null
        }
    }

}
