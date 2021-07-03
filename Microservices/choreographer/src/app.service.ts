import {HttpException, HttpService, HttpStatus, Injectable} from '@nestjs/common';
import {RedisService} from "nestjs-redis";
import {SendAnswerDto} from "./dto/send-answer.dto";
import {SendQuestionDto} from "./dto/send-question.dto";
import {catchError, map} from "rxjs/operators";
import {Request} from "express";

@Injectable()
export class ChoreographerService {
    private client: any;
    constructor(private httpService: HttpService,
                private redisService: RedisService) {
        this.getClient();
    }
    private async getClient() {
        this.client = await this.redisService.getClient();
    }

    async checkForLostAnswers () : Promise<string> {
        let msgs = await this.client.hget('choreographer', 'answers');
        let messages = JSON.parse(msgs);

        if (messages == null || messages == []) {
            //await this.client.hset('choreographer', 'answers', JSON.stringify(messages));
            return "No lost answers"
        }
        else {
            for (let i = 0; i<messages.length; i++) {
                await this.sendAnswers(messages[i]);
            }
            await this.client.hset('choreographer', 'answers', JSON.stringify([]));
            return "Answers retrieved and sent successfully"
        }
    }

    async checkForLostQuestions () : Promise<any> {
        let msg = await this.client.hget('choreographer', 'questions');
        let messages = JSON.parse(msg);

        if (messages == null || messages == []) {
            //await this.client.hset('choreographer', 'questions', JSON.stringify(messages));
            return "No lost questions"
        }
        else {
            for (let i = 0; i<messages.length; i++) {
                await this.sendQuestions(messages[i]);
            }
            await this.client.hset('choreographer', 'questions', JSON.stringify([]));
            return "Questions retrieved and sent successfully"
        }
    }


    /*
    async saveAnswerMsg (hash: string, channel : string, sendAnswerDto: SendAnswerDto) : Promise<any> {
        let m = await this.client.hget(hash, channel);
        let messages = JSON.parse(m);
        let answer_msg = {
            id : sendAnswerDto.id,
            text : sendAnswerDto.text,
            date_created : sendAnswerDto.date_created,
            Userid : sendAnswerDto.Userid,
            question: sendAnswerDto.question
        }

        if (messages == null) {
            messages = [];
            messages[0] = answer_msg;
        }
        else {
            messages.push(answer_msg);
        }

        return await this.client.hset(hash, channel, JSON.stringify(messages));
    }

    async saveQuestionMsg (hash: string, channel : string, sendQuestionDto: SendQuestionDto) : Promise<any>{
        let m = await this.client.hget(hash, channel);
        let messages = JSON.parse(m);
        let question_msg = {
            id : sendQuestionDto.id,
            title : sendQuestionDto.title,
            text : sendQuestionDto.text,
            date_created: sendQuestionDto.date_created,
            sum_answers: sendQuestionDto.sum_answers,
            Userid : sendQuestionDto.Userid,
            Keywords : sendQuestionDto.Keywords
        }

        if (messages == null) {
            messages = [];
            messages[0] = question_msg;
        }
        else {
            messages.push(question_msg);
        }

        return await this.client.hset(hash, channel, JSON.stringify(messages));
    }
    */


    async addToGeneralAnswerHash(answer : object)  {
        let a = await this.client.hget('general', 'answers');
        let currAnswers = JSON.parse(a);

        if (currAnswers == null || currAnswers == []) {
            currAnswers = [];
            currAnswers[0] = answer;
        }
        else {
            currAnswers.push(answer)
        }

        return await this.client.hset('general', 'answers', JSON.stringify(currAnswers));
    }

    async addToGeneralQuestionHash(question : object) {
        let q = await this.client.hget('general', 'questions');
        let currQuestions = JSON.parse(q);

        if (currQuestions == null || currQuestions == []) {
            currQuestions = [];
            currQuestions[0] = question;
        }
        else {
            currQuestions.push(question)
        }

        return await this.client.hset('general', 'questions', JSON.stringify(currQuestions));
    }

    async sendAnswers(sendAnswerDto: SendAnswerDto): Promise<any> {
        let new_answer = {
            id : sendAnswerDto.id,
            text : sendAnswerDto.text,
            date_created : sendAnswerDto.date_created,
            Userid : sendAnswerDto.Userid,
            question: sendAnswerDto.question
        }

        await this.addToGeneralAnswerHash(new_answer);

        let sub = await this.client.hget('subscribers', 'answers');
        let subscribers = JSON.parse(sub);
        if (subscribers == null) {
            return "No subscribers yet";
        }
        for (let i = 0; i<subscribers.length; i++){
            await this.httpService.post(subscribers[i], new_answer).pipe(
                catchError(async e => {
                    let m = await this.client.hget('answerMessages', subscribers[i]);
                    let messages = JSON.parse(m);

                    if (messages == null) {
                        messages = [];
                        messages[0] = new_answer;
                    }
                    else {
                        messages.push(new_answer);
                    }

                    await this.client.hset('answerMessages', subscribers[i], JSON.stringify(messages));

                    //await this.saveAnswerMsg('answerMessages', subscribers[i], sendAnswerDto);
                    //throw new HttpException("Lost connection", HttpStatus.SERVICE_UNAVAILABLE);
                })
            ).toPromise();
        }
        return HttpStatus.OK;
    }

    async sendQuestions(sendQuestionDto: SendQuestionDto): Promise<any> {
        let new_question = {
            id : sendQuestionDto.id,
            title : sendQuestionDto.title,
            text : sendQuestionDto.text,
            date_created: sendQuestionDto.date_created,
            sum_answers: sendQuestionDto.sum_answers,
            Userid : sendQuestionDto.Userid,
            Keywords : sendQuestionDto.Keywords
        }

        await this.addToGeneralQuestionHash(new_question);

        let sub = await this.client.hget('subscribers', 'questions');
        let subscribers = JSON.parse(sub);
        if (subscribers == null) {
            return "No subscribers yet";
        }
        for (let i = 0; i<subscribers.length; i++){
            await this.httpService.post(subscribers[i], new_question).pipe(
                catchError(async e => {
                    let m = await this.client.hget('questionMessages', subscribers[i]);
                    let messages = JSON.parse(m);

                    if (messages == null) {
                        messages = [];
                        messages[0] = new_question;
                    }
                    else {
                        messages.push(new_question);
                    }

                    await this.client.hset('questionMessages', subscribers[i], JSON.stringify(messages));

                    //await this.saveQuestionMsg('questionMessages', subscribers[i], sendQuestionDto);
                    //throw new HttpException("Lost connection", HttpStatus.SERVICE_UNAVAILABLE);
                }),
            ).toPromise();
        }
        return HttpStatus.OK;
    }

    async getAuthorization(cookie : object): Promise<boolean> {
        let sub = await this.client.hget('subscribers', 'auth');
        let subscribers = JSON.parse(sub);

        if (subscribers == null) {
            return null;
        }

        //i only have one subscriber - the authentication service subscriber
        try {
            return await this.httpService.post(subscribers[0]+'/authorization', cookie).pipe(map(response => response.data)).toPromise();
        } catch (e) {
            return null
        }
    }

    async getUserId(cookie : object): Promise<number> {
        let sub = await this.client.hget('subscribers', 'auth');
        let subscribers = JSON.parse(sub);

        if (subscribers == null) {
            return null;
        }

        //i only have one subscriber - the authentication service subscriber
        try {
            return await this.httpService.post(subscribers[0]+'/userId', cookie).pipe(map(response => response.data)).toPromise();
        } catch (e) {
            return null
        }
    }


}
