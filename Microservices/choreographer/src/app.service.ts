import {HttpException, HttpService, HttpStatus, Injectable} from '@nestjs/common';
import {RedisService} from "nestjs-redis";
import {SendAnswerDto} from "./dto/send-answer.dto";
import {SendQuestionDto} from "./dto/send-question.dto";
import {catchError} from "rxjs/operators";

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


    async sendAnswers(sendAnswerDto: SendAnswerDto): Promise<any> {
        /*let m = await this.client.hget('messages', 'answers');
        let messages = JSON.parse(m);
        let new_answer = {
            msg_id : messages.length+1,
            msg_date : Date.now(),
            answer_data : {
                id : sendAnswerDto.id,
                text : sendAnswerDto.text,
                date_created : sendAnswerDto.date_created,
                Userid : sendAnswerDto.Userid,
                question: sendAnswerDto.question
            }
        }
        messages.push(new_answer);
        await this.client.hset('messages', 'answers', JSON.stringify(messages));
        */

        let new_answer = {
            id : sendAnswerDto.id,
            text : sendAnswerDto.text,
            date_created : sendAnswerDto.date_created,
            Userid : sendAnswerDto.Userid,
            question: sendAnswerDto.question
        }

        let sub = await this.client.hget('subscribers', 'answers');
        let subscribers = JSON.parse(sub);
        for (let i = 0; i<subscribers.length; i++){
            this.httpService.post(subscribers[i], new_answer).pipe(
                catchError(async e => {
                    if (subscribers[i] == "http://localhost:8003/statistics/answer_message") {
                        //await this.saveAnswerMsg('answerMessages', 'statistics', sendAnswerDto);
                    }
                    else if (subscribers[i] == "http://localhost:8004/view_answer/message") {
                        //await this.saveAnswerMsg('answerMessages', 'view_answer', sendAnswerDto);
                    }

                    throw new HttpException("Lost connection", HttpStatus.SERVICE_UNAVAILABLE);
                }),
            );
        }
        return HttpStatus.OK;
    }

    async sendQuestions(sendQuestionDto: SendQuestionDto): Promise<any> {
        /*let m = await this.client.hget('messages', 'questions');
        let messages = JSON.parse(m);
        let new_question = {
            msg_id : messages.length+1,
            msg_date : Date.now(),
            question_data : {
                id : sendQuestionDto.id,
                title : sendQuestionDto.title,
                text : sendQuestionDto.text,
                date_created: sendQuestionDto.date_created,
                sum_answers: sendQuestionDto.sum_answers,
                Userid : sendQuestionDto.Userid
            },
            Keywords : sendQuestionDto.Keywords
        }
        messages.push(new_question);
        await this.client.hset('messages', 'questions', JSON.stringify(messages));
        */
        let new_question = {
            id : sendQuestionDto.id,
            title : sendQuestionDto.title,
            text : sendQuestionDto.text,
            date_created: sendQuestionDto.date_created,
            sum_answers: sendQuestionDto.sum_answers,
            Userid : sendQuestionDto.Userid,
            Keywords : sendQuestionDto.Keywords
        }

        let sub = await this.client.hget('subscribers', 'questions');
        let subscribers = JSON.parse(sub);
        for (let i = 0; i<subscribers.length; i++){
            this.httpService.post(subscribers[i], new_question).pipe(
                catchError(async e => {
                    if (subscribers[i] == "http://localhost:8000/create_answer/message") {
                        //await this.saveQuestionMsg('questionMessages', 'create_answer', sendQuestionDto);
                    }
                    else if (subscribers[i] == "http://localhost:8003/statistics/question_message") {
                        //await this.saveQuestionMsg('questionMessages', 'statistics', sendQuestionDto);
                    }
                    else if (subscribers[i] == "http://localhost:8005/view_question/message") {
                        await this.saveQuestionMsg('questionMessages', 'view_question', sendQuestionDto);
                    }

                    throw new HttpException("Lost connection", HttpStatus.SERVICE_UNAVAILABLE);
                }),
            );
        }
        return HttpStatus.OK;
    }

}
