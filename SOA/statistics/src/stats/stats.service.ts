import {HttpService, Injectable, NotFoundException} from '@nestjs/common';
import {catchError, map} from "rxjs/operators";
import {RedisService} from "nestjs-redis";
import {Request, response} from "express";


@Injectable()
export class StatsService {
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
            name : "Statistics",
            address : "http://localhost:8008/stats",
            description : "Returns data about Questions or/and Answers or/and Keywords or/and Users for statistic analysis",
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
            name : "Statistics",
            address : "http://localhost:8008/stats",
            description : "Returns data about Questions or/and Answers or/and Keywords or/and Users for statistic analysis",
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

    async auth(req : Request): Promise<boolean> {
        let services = await this.httpService.get("http://localhost:8010/discovery/services").pipe(map(response =>response.data)).toPromise();
        if (services == null)
            return false

        let authorization = {};
        for (let i=0; i<services.length; i++) {
            if (services[i]["name"] == "Authorization") {
                authorization = services[i]
            }
        }
        if (authorization == {})
            return false

        const cookie = req.cookies['token'];

        let body = {
            name : authorization["name"],
            url : authorization["url"],
            requestMethod: authorization["requestMethod"],
            params : {token : cookie}
        }

        return await this.httpService.get("http://localhost:8010/execution", body).pipe(map(response => response.data)).toPromise();
    }

    async findByKeywords(): Promise<Object[]> {
      const quest = await this.httpService.get("http://localhost:8006/statistics/findByKeywords")
          .pipe(map(response => response.data))
          .toPromise();

        if (!quest || !quest.length)
            throw new NotFoundException(`No questions found.`)

        return quest
    }

    async findByKeywordsUser(Userid: number): Promise<Object[]> {

        const quest= await this.httpService.get("http://localhost:8006/statistics/findByKeywordsUser/"+Userid)
            .pipe(map(response => response.data))
            .toPromise();

        if (!quest || !quest.length)
            throw new NotFoundException(`No questions for user with id "${Userid}" found.`)

        return quest
    }

    async showQuestionsPerDay(): Promise<Object[]> {

        const quest = await this.httpService.get("http://localhost:8006/statistics/showQuestionsPerDay")
            .pipe(map(response => response.data))
            .toPromise();

        if (!quest || !quest.length)
            throw new NotFoundException(`No questions found ths last month.`)
        return quest
    }

    async showQuestionsPerDayUser(Userid:number) : Promise<Object[]>{
        const quest = await this.httpService.get("http://localhost:8006/statistics/showQuestionsPerDayUser/"+Userid)
            .pipe(map(response => response.data))
            .toPromise();

        if (!quest || !quest.length)
            throw new NotFoundException(`No questions found ths last month for user with id ${Userid}.`)
        return quest

    }

    async showAnswersPerDay() : Promise<Object[]>{
        const ans = await this.httpService.get("http://localhost:8006/statistics/showAnswersPerDay")
            .pipe(map(response => response.data))
            .toPromise();

        if (!ans || !ans.length)
            throw new NotFoundException(`No answers found this last month.`)
        return ans
    }

    async showAnswersPerDayUser(Userid: number): Promise<Object[]> {
        const quest = await this.httpService.get("http://localhost:8006/statistics/showAnswersPerDayUser/"+Userid)
            .pipe(map(response => response.data))
            .toPromise();

        if (!quest || !quest.length)
            throw new NotFoundException(`No answers found ths last month for user with id ${Userid}.`)
        return quest
    }

    async countAnswersUser(Userid: number): Promise<Object[]>{
        const quest = await this.httpService.get("http://localhost:8006/statistics/countAnswersUser/"+Userid)
            .pipe(map(response => response.data))
            .toPromise();

        if (!quest || !quest.length)
            throw new NotFoundException(`No answers found for user with id ${Userid}.`)
        return quest
    }

    async countQuestionsUser(Userid: number): Promise<Object[]>{
        const quest = await this.httpService.get("http://localhost:8006/statistics/countQuestionsUser/"+Userid)
            .pipe(map(response => response.data))
            .toPromise();

        if (!quest || !quest.length)
            throw new NotFoundException(`No questions found for user with id ${Userid}.`)
        return quest
    }

}
