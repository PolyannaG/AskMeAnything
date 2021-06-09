import {BadRequestException, HttpService, Injectable, NotFoundException} from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import {InjectEntityManager} from "@nestjs/typeorm";
import {EntityManager, getConnection} from "typeorm";
import {Question} from "./entities/question.entity";
import {Keyword} from "./entities/keyword.entity";
import {RedisService} from "nestjs-redis";
import {MessageAnswerDto} from "./dto/Message-answer.dto";
import {catchError} from "rxjs/operators";


@Injectable()
export class QuestionService {
  private client: any;
  constructor(@InjectEntityManager() private manager : EntityManager,
              private httpService: HttpService,
              private redisService: RedisService) {
    this.getClient();
  }
  private async getClient() {
    this.client = await this.redisService.getClient();
  }

  async create(createQuestionDto: CreateQuestionDto) : Promise<Question>{
    return this.manager.transaction( async manager=>
    {
      //create question
      const question_to_create = {
        title: createQuestionDto.title,
        text: createQuestionDto.text,
        // date_created: Date.now()
        Userid: createQuestionDto.Userid
      }
   //   const Userid=createQuestionDto.Userid
   //   if (!Userid)
     //   throw new BadRequestException("User id is missing.")
   //   const user=await this.manager.findOne(User, createQuestionDto.Userid)
   //   if (!user)
   //     throw new NotFoundException(`User with id ${createQuestionDto.Userid} not found.`)
      const question = await this.manager.create(Question, question_to_create);
  //    question.user=user;
      const question_created = await this.manager.save(question)

      if ('keywords' in createQuestionDto) {
        console.log(createQuestionDto)
        //add keywords:
        for (let i = 0; i < (createQuestionDto.keywords).length; i++) {

          //check if keyword exists
          let keyword_ret = await this.manager.findOne(Keyword, createQuestionDto.keywords[i])
          console.log(keyword_ret)

          if (keyword_ret) {  // keyword exists, add relation
            await getConnection().createQueryBuilder().relation(Keyword, "questions").of(keyword_ret).add(question)

          } else {   //keyword does not exist, we have to create it
            let keyword_to_create = {
              keyword: createQuestionDto.keywords[i],
              questions: [question]
            }
            const keyword = this.manager.create(Keyword, keyword_to_create)
            await this.manager.save(keyword)
          }

        }
      }

      let msg = JSON.parse(JSON.stringify(question_created));
      if ('keywords' in createQuestionDto) {
        msg["Keywords"] = createQuestionDto.keywords;
        msg["sum_answers"] = 0;
      }
      else {
        msg["Keywords"] = [];
        msg["sum_answers"] = 0;
      }

      await this.httpService.post('http://localhost:4200/questions', msg).pipe(
          catchError(async e => {
            let m = await this.client.hget('choreographer', 'questions');
            let lost_questions = JSON.parse(m);

            if (lost_questions == null) {
              lost_questions = [];
              lost_questions[0] = msg;
            }
            else {
              lost_questions.push(msg);
            }

            await this.client.hset('choreographer', 'questions', JSON.stringify(lost_questions));
          })
      ).toPromise();

      return question_created
    });
  }

  /*
  async answerSubscribe(): Promise<string> {
    let sub = await this.client.hget('subscribers', 'answers');
    let subscribers = JSON.parse(sub);
    let myAddress = "http://localhost:8001/create_question/message";
    let alreadySubscribed = false;

    if (subscribers == null){
      subscribers = []
      subscribers[0] = myAddress
      await this.client.hset('subscribers', 'answers', JSON.stringify(subscribers));
      return "Subscribed";
    }
    else {
      for (let i = 0; i < subscribers.length; i++) {
        if (subscribers[i] == myAddress) {
          alreadySubscribed = true;
        }
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

  async getGeneralHash(): Promise<any> {
    let q = await this.client.hget('general', 'answers');
    let allMsg = JSON.parse(q);

    if (allMsg == null || allMsg == [])
      return "No messages";

    await this.manager.transaction(async h =>{

    });
    return "Retrieved all messages";
  }

  async updateSumAnswers (msgDto : MessageAnswerDto): Promise<any> {
    return this.manager.transaction( async updateAnswers => {
      const questionID = msgDto.question["id"];

      const the_update = await this.manager.increment(Question, {id : questionID}, "sum_answers", 1);

      return the_update;
    });
  }

  async retrieveLostMessages() : Promise<string> {
    let msg = await this.client.hget('answerMessages', "http://localhost:8001/create_question/message");
    let messages = JSON.parse(msg);

    if (messages == null || messages == []) {
      //await this.client.hset('answerMessages', "http://localhost:8001/create_question/message", JSON.stringify(messages));
      return "No lost messages"
    }
    else {
      for (let i = 0; i < messages.length; i++) {
        let questionID = messages[i].question["id"];

        await this.manager.increment(Question, {id : questionID}, "sum_answers", 1);
      }

      await this.client.hset('answerMessages', "http://localhost:8001/create_question/message", JSON.stringify([]));
      return "Saved data successfully";
    }
  }
   */

}
