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

    async sendAnswers(sendAnswerDto: SendAnswerDto): Promise<any> {
        let m = await this.client.hget('messages', 'answers');
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

        let sub = await this.client.hget('subscribers', 'answers');
        let subscribers = JSON.parse(sub);
        for (let i = 0; i<subscribers.length; i++){
            this.httpService.post(subscribers[i], new_answer).pipe(
                catchError(e => {
                    throw new HttpException("Lost connection", HttpStatus.SERVICE_UNAVAILABLE);
                }),
            );
        }
        return "All answers sent";
    }

    async sendQuestions(sendQuestionDto: SendQuestionDto): Promise<any> {
        let m = await this.client.hget('messages', 'questions');
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
            keywords_data : sendQuestionDto.Keywords
        }
        messages.push(new_question);
        await this.client.hset('messages', 'questions', JSON.stringify(messages));

        let sub = await this.client.hget('subscribers', 'questions');
        let subscribers = JSON.parse(sub);
        for (let i = 0; i<subscribers.length; i++){
            this.httpService.post(subscribers[i], new_question).pipe(
                catchError(e => {
                    throw new HttpException("Lost connection", HttpStatus.SERVICE_UNAVAILABLE);
                }),
            );
        }
        return "All questions sent";
    }

}
