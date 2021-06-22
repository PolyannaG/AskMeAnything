import {HttpService, Injectable, NotFoundException} from '@nestjs/common';
import {map} from "rxjs/operators";


@Injectable()
export class StatsService {
    constructor(private httpService: HttpService) {}

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
