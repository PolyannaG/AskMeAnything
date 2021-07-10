import {HttpService, Injectable, NotFoundException, ServiceUnavailableException} from '@nestjs/common';
import {catchError, map} from "rxjs/operators";
import {RedisService} from "nestjs-redis";
import {Request} from "express";


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


    async findByKeywords(): Promise<Object[]> {
      const quest = await this.httpService.get("https://datalayersoa.herokuapp.com/statistics/findByKeywords")
          .pipe(map(response => response.data))
          .toPromise();

        if (!quest || !quest.length)
            throw new NotFoundException(`No questions found.`)

        return quest
    }

    async findByKeywordsUser(Userid: number): Promise<Object[]> {

        const quest= await this.httpService.get("https://datalayersoa.herokuapp.com/statistics/findByKeywordsUser/"+Userid)
            .pipe(map(response => response.data))
            .toPromise();

        if (!quest || !quest.length)
            throw new NotFoundException(`No questions for user with id "${Userid}" found.`)

        return quest
    }

    async showQuestionsPerDay(): Promise<Object[]> {

        const quest = await this.httpService.get("https://datalayersoa.herokuapp.com/statistics/showQuestionsPerDay")
            .pipe(map(response => response.data))
            .toPromise();

        if (!quest || !quest.length)
            throw new NotFoundException(`No questions found ths last month.`)
        return quest
    }

    async showQuestionsPerDayUser(Userid:number) : Promise<Object[]>{
        const quest = await this.httpService.get("https://datalayersoa.herokuapp.com/statistics/showQuestionsPerDayUser/"+Userid)
            .pipe(map(response => response.data))
            .toPromise();

        if (!quest || !quest.length)
            throw new NotFoundException(`No questions found ths last month for user with id ${Userid}.`)
        return quest

    }

    async showAnswersPerDay() : Promise<Object[]>{
        const ans = await this.httpService.get("https://datalayersoa.herokuapp.com/statistics/showAnswersPerDay")
            .pipe(map(response => response.data))
            .toPromise();

        if (!ans || !ans.length)
            throw new NotFoundException(`No answers found this last month.`)
        return ans
    }

    async showAnswersPerDayUser(Userid: number): Promise<Object[]> {
        const quest = await this.httpService.get("https://datalayersoa.herokuapp.com/statistics/showAnswersPerDayUser/"+Userid)
            .pipe(map(response => response.data))
            .toPromise();

        if (!quest || !quest.length)
            throw new NotFoundException(`No answers found ths last month for user with id ${Userid}.`)
        return quest
    }

    async countAnswersUser(Userid: number): Promise<Object[]>{
        const quest = await this.httpService.get("https://datalayersoa.herokuapp.com/statistics/countAnswersUser/"+Userid)
            .pipe(map(response => response.data))
            .toPromise();

        if (!quest || !quest.length)
            throw new NotFoundException(`No answers found for user with id ${Userid}.`)
        return quest
    }

    async countQuestionsUser(Userid: number): Promise<Object[]>{
        const quest = await this.httpService.get("https://datalayersoa.herokuapp.com/statistics/countQuestionsUser/"+Userid)
            .pipe(map(response => response.data))
            .toPromise();

        if (!quest || !quest.length)
            throw new NotFoundException(`No questions found for user with id ${Userid}.`)
        return quest
    }


    async Subscribe(): Promise<any> {
        let body = {
            name : "Statistics",
            address : "http://localhost:8008/stats",
            description : "Returns data about Questions or/and Answers or/and Keywords or/and Users for statistic analysis",
            services : []
        };

        return await this.httpService.post("https://esbsoa.herokuapp.com/management/subscribe", body)
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
            name : "Statistics",
            address : "https://statisticssoa.herokuapp.com/stats",
            description : "Returns data about Questions or/and Answers or/and Keywords or/and Users for statistic analysis",
            services : []
        };

        return await this.httpService.post("https://esbsoa.herokuapp.com/management/unsubscribe", body)
            .pipe(catchError(async e => {
                console.log("in error");
                let unsub = await this.client.hget('lost', 'unregisters');
                let sub = await this.client.hget('lost', 'registers');
                let lost_registrations = JSON.parse(sub);
                let lost_unregistrations = JSON.parse(unsub);
                let newSub = [];

                if (lost_registrations != null) {
                    for (let j = 0; j < lost_registrations.length; j++) {
                        if (lost_registrations[j]["address"] != body["address"]) {
                            newSub.push(lost_registrations[j]);
                        }
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
            services = await this.httpService.get("https://esbsoa.herokuapp.com/discovery/services").pipe(map(response => response.data)).toPromise();
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

        //const cookie = req.cookies['token'];
        const cookie = req.headers['x-access-token']

        const body = {
            name: authorization[0]["name"],
            url: authorization[0]["url"],
            requestMethod: authorization[0]["requestMethod"],
            params: {token: cookie}
        };

        try {
            return await this.httpService.post("https://esbsoa.herokuapp.com/execution", body).pipe(map(response => response.data)).toPromise();
        } catch (e) {
            return null
        }
    }

    async cookieUserId(req : Request): Promise<number> {
        let services;
        try {
            services = await this.httpService.get("https://esbsoa.herokuapp.com/discovery/services").pipe(map(response =>response.data)).toPromise();
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

       // const cookie = req.cookies['token'];
        const cookie = req.headers['x-access-token']

        const body = {
            name: cookieUserId[0]["name"],
            url: cookieUserId[0]["url"],
            requestMethod: cookieUserId[0]["requestMethod"],
            params: {token: cookie}
        };

        try {
            return await this.httpService.post("https://esbsoa.herokuapp.com/execution", body).pipe(map(response => response.data)).toPromise();
        } catch (e) {
            return null
        }
    }

}
