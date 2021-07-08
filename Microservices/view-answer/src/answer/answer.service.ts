import {HttpService, Injectable, NotFoundException} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import {createQueryBuilder, EntityManager, LessThan} from "typeorm";
import {RedisService} from "nestjs-redis";
import {addMonths} from 'date-fns'
import {Answer} from "./entities/answer.entity";
import {MessageDto} from "./dto/Message.dto";
import {Request} from "express";
import {catchError, map} from "rxjs/operators";


@Injectable()
export class ViewAnswerService {
  private client: any;
  constructor(@InjectEntityManager() private manager : EntityManager,
              private httpService: HttpService,
              private redisService: RedisService) {
    this.getClient();
  }
  private async getClient() {
    this.client = await this.redisService.getClient();
  }

  async auth(req : Request): Promise<boolean> {
    try {
     // let cookie = req.cookies['token'];
      const cookie = req.headers['x-access-token'];
      const body = {
        token: cookie
      }
      return await this.httpService.post("https://choreographerms.herokuapp.com/get_auth", body).pipe(map(response => response.data)).toPromise();
    } catch (e) {
      return null
    }
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

  async findAllDate(date_from: Date, userid: Number): Promise<Answer[]> {
    const ans = await this.manager.find(Answer, {
      where: {date_created: LessThan(date_from), userid: userid},
      order: {
        date_created: "DESC",
      },
      take: 10,

    });
    if (!ans || ans.length == 0)
      throw new NotFoundException(`No answers found earlier than date ${date_from} found.`)
    return ans
  }


  async subscribe (): Promise<string> {
    let sub = await this.client.hget('subscribers', 'answers');
    let subscribers = JSON.parse(sub);
    let myAddress = "https://viewanswerms.herokuapp.com/view_answer/message";
    let alreadySubscribed = false;

    if (subscribers == null){
      subscribers = []
      subscribers[0] = myAddress
      await this.client.hset('subscribers', 'answers', JSON.stringify(subscribers));
      await this.getGeneralHash();
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
        await this.getGeneralHash();
        return "Subscribed";
      }
      else
        return "Already subscribed";
    }
  }

  async getGeneralHash() {
    let a = await this.client.hget('general', 'answers');
    let allMsg = JSON.parse(a);

    if (allMsg == null || allMsg == [])
      return "No messages";

    await this.manager.transaction(async h =>{
      let databaseAnswers = await this.manager.query(`SELECT a.id as id FROM answer AS a`);
      let databaseAnswerIDs = [];

      for (let i=0; i<databaseAnswers.length; i++){
        databaseAnswerIDs[i] = databaseAnswers[i].id;
      }

      for (let i = 0; i < allMsg.length; i++) {
        if ( !databaseAnswerIDs.includes(allMsg[i].id) ) {
          await this.updateAnswersDatabase(allMsg[i]);
        }
      }
    });
    return "Retrieved all messages";
  }

  async updateAnswersDatabase (msgDto : MessageDto): Promise<Answer> {
    return this.manager.transaction( async updateAnswers => {
      const answer_to_be_created = {
        id: msgDto.id,
        text: msgDto.text,
        date_created: msgDto.date_created,
        userid: msgDto.Userid,
        questionId: msgDto.question["id"]
      }

      try {
        const the_answer = await this.manager.create(Answer, answer_to_be_created);
        const answer_created = await this.manager.save(the_answer);
        return answer_created;
      }
      catch (e) {
          return null
      }

    });
  }

  async retrieveLostMessages() : Promise<string> {
    let msg = await this.client.hget('answerMessages', "https://viewanswerms.herokuapp.com/view_answer/message");
    let messages = JSON.parse(msg);

    if (messages == null || messages == []) {
      //await this.client.hset('answerMessages', "http://localhost:8004/view_answer/message", JSON.stringify(messages));
      return "No lost messages"
    }
    else {
      for (let i = 0; i < messages.length; i++) {
        await this.updateAnswersDatabase(messages[i])
      }

      await this.client.hset('answerMessages', "https://viewanswerms.herokuapp.com/view_answer/message", JSON.stringify([]));
      return "Saved data successfully";
    }
  }

  async cookieUserId(req : Request): Promise<number> {
    try {
     // const cookie = req.cookies['token'];
      const cookie = req.headers['x-access-token'];

      const body = {
        token: cookie
      };

      return await this.httpService.post("https://choreographerms.herokuapp.com/get_userId", body).pipe(map(response => response.data)).toPromise();
    } catch (e) {
      return null
    }
  }

}
