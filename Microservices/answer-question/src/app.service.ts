import {HttpService, Injectable, NotFoundException} from '@nestjs/common';
import {InjectEntityManager, InjectRepository} from "@nestjs/typeorm"
import {createQueryBuilder, EntityManager, Repository} from "typeorm"
import {CreateAnswerDto} from "./dto/create-answer.dto";
import {Answer} from "./entities/answer.entity";
import {Question} from "./entities/question.entity";
import {RedisService} from "nestjs-redis";
import {MessageDto} from "./dto/Message.dto";

@Injectable()
export class AnswerService {
  private client: any;
  constructor(@InjectEntityManager() private manager : EntityManager,
              private httpService: HttpService,
              private redisService: RedisService) {
    this.getClient();
  }
  private async getClient() {
    this.client = await this.redisService.getClient();
  }

  async create (paramId: number, createAnswerDto: CreateAnswerDto) : Promise<Answer> {
    return this.manager.transaction( async manager => {

      const myQuestion = await this.manager.findOne(Question, paramId);

      if (!myQuestion)
        throw new NotFoundException(`Question with id ${paramId} not found, so it can't be answered`);

      else {
        const answer_to_be_created = {
          text: createAnswerDto.text,
          question : {id: paramId},
          Userid : createAnswerDto.Userid
        }
        const the_answer = await this.manager.create(Answer, answer_to_be_created);
        const answer_created = await this.manager.save(the_answer);

        await this.httpService.post('http://localhost:4200/answers', answer_created);

        return answer_created;
      }
    });
  }

  async subscribe (): Promise<string> {
    let sub = await this.client.hget('subscribers', 'questions');
    let subscribers = JSON.parse(sub);
    let myAddress = "http://localhost:8000/create_answer/message";
    let alreadySubscribed = false;

    if (subscribers == null){
      subscribers = []
      subscribers[0] = myAddress
      await this.client.hset('subscribers', 'questions', JSON.stringify(subscribers));
      return "Subscribed";
    }
    else {
      for (let i = 0; i < subscribers.length; i++) {
        if (subscribers[i] == myAddress)
          alreadySubscribed = true;
      }
      if (alreadySubscribed == false) {
        subscribers.push(myAddress);
        await this.client.hset('subscribers', 'questions', JSON.stringify(subscribers));
        return "Subscribed";
      }
      else
        return "Already subscribed";
    }
  }

  async updateQuestionDatabase (msgDto : MessageDto): Promise<Question> {
    return this.manager.transaction(async updateQuestionID => {
      const questionId_to_be_created = {
        id : msgDto.question_data.id
      }
      const the_questionId = await this.manager.create(Question, questionId_to_be_created);
      const questionId_created = await this.manager.save(the_questionId);

      return questionId_created;
    });
  }

  /*async retrieveLostMessages() {
    let msg = await this.client.hget('messages', 'answers');
    let messages = JSON.parse(msg);

    let quest = await createQueryBuilder().select(`id` ).from('question', 'Question').orderBy(`id DESC`).limit(1);

    for (let i = 0; i < messages.length; i++) {

    }

  }*/

}
