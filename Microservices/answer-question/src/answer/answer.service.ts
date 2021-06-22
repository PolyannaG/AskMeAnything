import {HttpService, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import {InjectEntityManager, InjectRepository} from "@nestjs/typeorm"
import {createQueryBuilder, EntityManager, Repository} from "typeorm"
import {RedisService} from "nestjs-redis";
import {CreateAnswerDto} from "./dto/create-answer.dto";
import {Answer} from "./entities/answer.entity";
import {Question} from "./entities/question.entity";
import {MessageDto} from "./dto/Message.dto";
import {catchError} from "rxjs/operators";


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

        await this.httpService.post('http://localhost:4200/answers', answer_created).pipe(
            catchError(async e => {
              let m = await this.client.hget('choreographer', 'answers');
              let lost_answers = JSON.parse(m);

              if (lost_answers == null) {
                lost_answers = [];
                lost_answers[0] = answer_created;
              }
              else {
                lost_answers.push(answer_created);
              }

              await this.client.hset('choreographer', 'answers', JSON.stringify(lost_answers));
            })
        ).toPromise();

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
      subscribers = [];
      subscribers[0] = myAddress;
      await this.client.hset('subscribers', 'questions', JSON.stringify(subscribers));
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
        await this.client.hset('subscribers', 'questions', JSON.stringify(subscribers));
        await this.getGeneralHash();
        return "Subscribed";
      }
      else
        return "Already subscribed";
    }
  }

  async getGeneralHash(): Promise<string> {
    let q = await this.client.hget('general', 'questions');
    let allMsg = JSON.parse(q);

    if (allMsg == null || allMsg == [])
      return "No messages";

    await this.manager.transaction(async h =>{
      let databaseQuestions = await this.manager.query(`SELECT * FROM answer_question.question`);
      let databaseQuestionIDs = [];

      for (let i=0; i<databaseQuestions.length; i++){
        databaseQuestionIDs[i] = databaseQuestions[i].id;
      }

      for (let i = 0; i < allMsg.length; i++) {
        if ( !databaseQuestionIDs.includes(allMsg[i].id) ) {
          await this.updateQuestionDatabase(allMsg[i]);
        }
      }
    });
    return "Retrieved all messages";
  }

  async updateQuestionDatabase (msgDto : MessageDto): Promise<Question> {
    return this.manager.transaction(async updateQuestionID => {
      const questionId_to_be_created = {
        id : msgDto.id
      }
      try {
        const the_questionId = await this.manager.create(Question, questionId_to_be_created);
        let questionId_created = await this.manager.save(the_questionId);

        return questionId_created
      }
      catch (e) {
        return null
      }
    });
  }

  async retrieveLostMessages() : Promise<string> {
    let msg = await this.client.hget('questionMessages', "http://localhost:8000/create_answer/message");
    let messages = JSON.parse(msg);

    if (messages == null || messages == []) {
      //await this.client.hset('questionMessages', "http://localhost:8000/create_answer/message", JSON.stringify(messages));
      return "No lost messages"
    }
    else {
      for (let i = 0; i < messages.length; i++) {
        await this.updateQuestionDatabase(messages[i]);
      }
      await this.client.hset('questionMessages', "http://localhost:8000/create_answer/message", JSON.stringify([]));
      return "Saved data successfully";
    }
  }

}
