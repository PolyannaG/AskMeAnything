import {HttpService, Injectable, NotFoundException} from '@nestjs/common';
import {InjectEntityManager, InjectRepository} from "@nestjs/typeorm";
import {createQueryBuilder, EntityManager, getConnection, InsertResult, Repository} from "typeorm";
import {addMonths} from 'date-fns'
import {RedisService} from "nestjs-redis";
import {Keyword} from "./entities/keyword.entity";
import {MessageAnswerDto} from "./dto/Message-answer.dto";
import {Answer} from "./entities/answer.entity";
import {MessageQuestionDto} from "./dto/Message-question.dto";
import {Question} from "./entities/question.entity";
import {Request} from "express";
import {map} from "rxjs/operators";


@Injectable()
export class StatisticsService {
  private client: any;
  constructor(@InjectEntityManager() private manager : EntityManager,
              @InjectRepository(Keyword) private readonly keywordRepository : Repository<Keyword>,
              private redisService: RedisService,
              private httpService: HttpService,) {
    this.getClient();
  }
  private async getClient() {
    this.client = await this.redisService.getClient();
  }

  async findByKeywords(): Promise<Object[]> {
    // const quest= await this.keywordRepository.createQueryBuilder("Keyword").leftJoin("Keyword.questions", "questions").loadRelationCountAndMap('Keyword.questionCount', 'Keyword.questions').take(10).getMany()
    //const quest= await createQueryBuilder().select('COUNT(*) as questionCount, keywordKeyword as keyword').from('keyword_questions_question','keyword_questions_question').groupBy('keyword_questions_question.keywordKeyword').orderBy('count', 'DESC').take(10).getRawMany()
    const quest = await createQueryBuilder().select('COUNT(*) as questionCount, keyword_questions_question.keywordKeyword as keyword').from('keyword_questions_question', 'keyword_questions_question').groupBy('keyword_questions_question.keywordKeyword').orderBy('questionCount', 'DESC').take(10).getRawMany()

    if (!quest || !quest.length)
      throw new NotFoundException(`No questions found.`)
    return quest
  }

  async findByKeywordsUser(Userid: number): Promise<Object[]> {

    const quest= await this.manager.query(`SELECT COUNT(*) as "questionCount", "C"."keywordKeyword" as "keyword" FROM (SELECT * from  "keyword_questions_question" as "A"  INNER JOIN "question" as "B" ON "A"."questionId"="B"."id" WHERE "B"."Userid"=${Userid}) as "C"  GROUP BY "C"."keywordKeyword"`)

    if (!quest || !quest.length)
      throw new NotFoundException(`No questions for user with id "${Userid}" found.`)

    return quest
  }

  async showQuestionsPerDay(): Promise<Object[]> {
    const d_to = new Date();
    d_to.setTime(d_to.getTime() - (d_to.getTimezoneOffset() * 60000));
    const date = d_to.toISOString();

    const quest = await createQueryBuilder().select(`SUBSTRING(cast(date_created as varchar),0,11)  as date_part,COUNT(*)`).from('question', 'Question').andWhere(`date_created <= '${date}'`).andWhere(`date_created >= '${(addMonths(d_to, -1)).toISOString()}'`).groupBy(`SUBSTRING(cast(date_created as varchar),0,11)`).orderBy('count', 'DESC').take(10).getRawMany()

    //const quest = await this.questionRepository.query(`SELECT ARRAY_AGG(question.id) AS questions, * from Question WHERE date_created <= '${date}' AND date_created >= '${(addMonths(d_to, -1)).toISOString()}' GROUP BY EXTRACT(DAY FROM date_created)`)
    //const quest = await this.questionRepository.query(`SELECT COUNT(qu) ,EXTRACT(DAY FROM date_created) AS day from Question WHERE date_created <= '${date}' AND date_created >= '${(addMonths(d_to, -1)).toISOString()}' GROUP BY EXTRACT(DAY FROM date_created)`)
    // const quest = await entityManager.query(`SELECT * FROM question`)
    if (!quest || !quest.length)
      throw new NotFoundException(`No questions found ths last month.`)
    return quest
  }

  async showQuestionsPerDayUser(Userid:number) : Promise<Object[]>{
    const d_to = new Date();
    d_to.setTime(d_to.getTime() - (d_to.getTimezoneOffset() * 60000));
    const date = d_to.toISOString();
    const quest = await createQueryBuilder().select(`SUBSTRING(cast(date_created as varchar),0,11)  as date_part,COUNT(*)`).from('question', 'Question').andWhere(`date_created <= '${date}'`).andWhere(`date_created >= '${(addMonths(d_to, -1)).toISOString()}'`).andWhere(`Question.Userid=${Userid}`).groupBy(`SUBSTRING(cast(date_created as varchar),0,11)`).orderBy('count', 'DESC').take(10).getRawMany()
    if (!quest || !quest.length)
      throw new NotFoundException(`No questions found ths last month for user with id ${Userid}.`)
    return quest

  }

  async showAnswersPerDay() : Promise<Object[]>{
    const d_to = new Date();
    d_to.setTime(d_to.getTime() - (d_to.getTimezoneOffset() * 60000));
    const date = d_to.toISOString();

    const ans = await createQueryBuilder().select(`SUBSTRING(cast(date_created as varchar),0,11)  as date_part,COUNT(*)` ).from('answer', 'Answer').andWhere(`date_created <= '${date}'`).andWhere(`date_created >= '${(addMonths(d_to, -1)).toISOString()}'`).groupBy(  `SUBSTRING(cast(date_created as varchar),0,11)`).orderBy('count', 'DESC').take(10).getRawMany()

    if (!ans || !ans.length)
      throw new NotFoundException(`No answers found this last month.`)
    return ans
  }

  async showAnswersPerDayUser(Userid: number): Promise<Object[]> {
    const d_to = new Date();
    d_to.setTime(d_to.getTime() - (d_to.getTimezoneOffset() * 60000));
    const date = d_to.toISOString();

    const quest = await createQueryBuilder().select(`SUBSTRING(cast(date_created as varchar),0,11)  as date_part,COUNT(*)`).from('Answer', 'Answer').andWhere(`date_created <= '${date}'`).andWhere(`date_created >= '${(addMonths(d_to, -1)).toISOString()}'`).andWhere(`"Answer"."Userid"=${Userid}`).groupBy(`SUBSTRING(cast(date_created as varchar),0,11)`).orderBy('count', 'DESC').take(10).getRawMany()
    if (!quest || !quest.length)
      throw new NotFoundException(`No answers found ths last month for user with id ${Userid}.`)
    return quest
  }

  async countAnswersUser(Userid: number): Promise<Object[]>{
    const quest=await this.manager.query(`SELECT COUNT(*) FROM "answer" as A WHERE A."Userid"=${Userid}`)
    if (!quest || !quest.length)
      throw new NotFoundException(`No answers found for user with id ${Userid}.`)
    return quest
  }

  async countQuestionsUser(Userid: number): Promise<Object[]>{
    const quest=await this.manager.query(`SELECT COUNT(*) FROM "question" as A WHERE A."Userid"=${Userid}`)
    if (!quest || !quest.length)
      throw new NotFoundException(`No questions found for user with id ${Userid}.`)
    return quest
  }


  async subscribeAnswers (): Promise<string> {
    let sub = await this.client.hget('subscribers', 'answers');
    let subscribers = JSON.parse(sub);
    let myAddress = "https://statisticsms.herokuapp.com/statistics/answer_message";
    let alreadySubscribed = false;

    if (subscribers == null){
      subscribers = []
      subscribers[0] = myAddress
      await this.client.hset('subscribers', 'answers', JSON.stringify(subscribers));
      await this.getGeneralAnswersHash();
      return "Subscribed to answers";
    }
    else {
      for (let i = 0; i < subscribers.length; i++) {
        if (subscribers[i] == myAddress)
          alreadySubscribed = true;
      }
      if (alreadySubscribed == false) {
        subscribers.push(myAddress);
        await this.client.hset('subscribers', 'answers', JSON.stringify(subscribers));
        await this.getGeneralAnswersHash();
        return "Subscribed to answers";
      }
      else
        return "Already subscribed to answers";
    }
  }

  async getGeneralAnswersHash() {
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

  async subscribeQuestions (): Promise<string> {
    let sub = await this.client.hget('subscribers', 'questions');
    let subscribers = JSON.parse(sub);
    let myAddress = "https://statisticsms.herokuapp.com/statistics/question_message";
    let alreadySubscribed = false;

    if (subscribers == null){
      subscribers = []
      subscribers[0] = myAddress
      await this.client.hset('subscribers', 'questions', JSON.stringify(subscribers));
      await this.getGeneralQuestionsHash();
      return "Subscribed to questions";
    }
    else {
      for (let i = 0; i < subscribers.length; i++) {
        if (subscribers[i] == myAddress)
          alreadySubscribed = true;
      }
      if (alreadySubscribed == false) {
        subscribers.push(myAddress);
        await this.client.hset('subscribers', 'questions', JSON.stringify(subscribers));
        await this.getGeneralQuestionsHash();
        return "Subscribed to questions";
      }
      else
        return "Already subscribed to questions";
    }
  }

  async getGeneralQuestionsHash() {
    let q = await this.client.hget('general', 'questions');
    let allMsg = JSON.parse(q);

    if (allMsg == null || allMsg == [])
      return "No messages";

    await this.manager.transaction(async h =>{
      let databaseQuestions = await this.manager.query(`SELECT q.id as id FROM question AS q`);
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

  async updateAnswersDatabase (msgDto : MessageAnswerDto): Promise<Answer> {
    return this.manager.transaction( async updateAnswers => {
      const answer_to_be_created = {
        id: msgDto.id,
        date_created: msgDto.date_created,
        Userid: msgDto.Userid
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

  async updateQuestionDatabase (msgDto : MessageQuestionDto): Promise<Question> {
    return this.manager.transaction( async manager=> {
      const question_to_insert = {
        id: msgDto.id,
        date_created: msgDto.date_created,
        Userid: msgDto.Userid
      }

      try {
        const question = await this.manager.create(Question, question_to_insert);
        const question_created = await this.manager.save(question)

        if (msgDto.Keywords != []) {
          for (let i = 0; i < (msgDto.Keywords).length; i++) {
            //check if keyword exists
            let keyword_ret = await this.manager.findOne(Keyword, msgDto.Keywords[i])

            if (keyword_ret) {  // keyword exists, add relation
              await getConnection().createQueryBuilder().relation(Keyword, "questions").of(keyword_ret).add(question)

            } else {   //keyword does not exist, we have to create it
              let keyword_to_create = {
                keyword: msgDto.Keywords[i],
                questions: [question]
              }
              const keyword = await this.manager.create(Keyword, keyword_to_create)
              await this.manager.save(keyword)
            }
          }
        }
        return question_created;
      }
      catch (e) {
        return null
      }
    });
  }

  async retrieveLostAnswerMessages() : Promise<string> {
    let msg = await this.client.hget('answerMessages', "https://statisticsms.herokuapp.com/statistics/answer_message");
    let messages = JSON.parse(msg);

    if (messages == null || messages == []) {
      //await this.client.hset('answerMessages', "http://localhost:8003/statistics/answer_message", JSON.stringify(messages));
      return "No lost messages"
    }
    else {
      for (let i = 0; i < messages.length; i++) {
        await this.updateAnswersDatabase(messages[i]);
      }

      await this.client.hset('answerMessages', "https://statisticsms.herokuapp.com/statistics/answer_message", JSON.stringify([]));
      return "Saved data successfully";
    }
  }

  async retrieveLostQuestionMessages() : Promise<string> {
    let msg = await this.client.hget('questionMessages', "https://statisticsms.herokuapp.com/statistics/question_message");
    let messages = JSON.parse(msg);

    if (messages == null || messages == []) {
      //await this.client.hset('questionMessages', "http://localhost:8003/statistics/question_message", JSON.stringify(messages));
      return "No lost messages"
    }
    else {
      for (let i = 0; i < messages.length; i++) {
        await this.updateQuestionDatabase(messages[i]);
      }

      await this.client.hset('questionMessages', "https://statisticsms.herokuapp.com/statistics/question_message", JSON.stringify([]));
      return "Saved data successfully";
    }
  }

  async auth(req : Request): Promise<boolean> {
    try {
      //let cookie = req.cookies['token'];
      const cookie = req.headers['x-access-token'];
      const body = {
        token: cookie,
      }
      return await this.httpService.post("https://choreographerms.herokuapp.com/get_auth", body).pipe(map(response => response.data)).toPromise();
    } catch (e) {
      return null
    }
  }

  async cookieUserId(req : Request): Promise<number> {
    try {
      // const cookie = req.cookies['token'];
      const cookie = req.headers['x-access-token'];

      const body = {
        token: cookie,
      };

      return await this.httpService.post("https://choreographerms.herokuapp.com/get_userId", body).pipe(map(response => response.data)).toPromise();
    } catch (e) {
      return null
    }
  }

}
