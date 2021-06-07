import {Injectable, NotFoundException} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import {EntityManager} from "typeorm";
import {Answer} from "./entities/answer.entity";
import {paramIdDto} from "./dto/ParamId.dto";
import {RedisService} from "nestjs-redis";
import {MessageDto} from "./dto/Message.dto";


@Injectable()
export class ViewAnswerService {
  private client: any;
  constructor(@InjectEntityManager() private manager : EntityManager,
              private redisService: RedisService) {
    this.getClient();
  }
  private async getClient() {
    this.client = await this.redisService.getClient();
  }
  
  async findQuestionAnswers(QuestionID : number): Promise<Object[]> {

    const question_answers = await this.manager.find(Answer, {where: {questionId: QuestionID}});
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
    const my_answers = await this.manager.find(Answer, {where: {userid: UserID}});
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

  async subscribe (): Promise<string> {
    let sub = await this.client.hget('subscribers', 'answers');
    let subscribers = JSON.parse(sub);
    let myAddress = "http://localhost:8004/view_answer/message";
    let alreadySubscribed = false;

    if (subscribers == null){
      subscribers = []
      subscribers[0] = myAddress
      await this.client.hset('subscribers', 'answers', JSON.stringify(subscribers));
      return "Subscribed";
    }
    else {
      for (let i = 0; i < subscribers.length; i++) {
        if (subscribers[i] == myAddress)
          alreadySubscribed = true;
      }
      if (alreadySubscribed == false) {
        subscribers.push(myAddress);
        await this.client.hset('subscribers', 'answers', JSON.stringify(subscribers));
        return "Subscribed";
      }
      else
        return "Already subscribed";
    }
  }

  async updateAnswersDatabase (msgDto : MessageDto): Promise<Answer> {
    return this.manager.transaction( async updateAnswers => {
      const answer_to_be_created = {
        id: msgDto.answer_data.id,
        text: msgDto.answer_data.text,
        date_created: msgDto.answer_data.date_created,
        userid: msgDto.answer_data.Userid,
        questionId: msgDto.answer_data.question["id"]
      }
      const the_answer = await this.manager.create(Answer, answer_to_be_created);
      const answer_created = await this.manager.save(the_answer);

      return answer_created;
    });
  }


}
