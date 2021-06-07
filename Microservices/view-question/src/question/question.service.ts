import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectEntityManager, InjectRepository} from "@nestjs/typeorm";
import {createQueryBuilder, EntityManager, getConnection, LessThan, Repository} from "typeorm";
import {Question} from "./entities/question.entity";
import {Keyword} from "./entities/keyword.entity";
import {addMonths} from 'date-fns'
import {RedisService} from "nestjs-redis";
import {MessageQuestionDto} from "./dto/Message-question.dto";
import {MessageAnswerDto} from "./dto/Message-answer.dto";


@Injectable()
export class QuestionService {

  private client: any;
  constructor(@InjectEntityManager() private manager : EntityManager,
              @InjectRepository(Keyword) private readonly keywordRepository : Repository<Keyword>,
              private redisService: RedisService) {
    this.getClient();
  }

  private async getClient() {
    this.client = await this.redisService.getClient();
  }

  async findAll(date_from:Date) : Promise<Question[]>{
   const questions= await this.manager.find(Question,{where: {date_created : LessThan(date_from)}, take: 10, relations:["keywords"]});
   if (!questions || questions.length==0)
     throw new NotFoundException(`No questions earlier than date ${date_from} found.`)
    return questions
  }

  async findAllUser(date_from:Date, Userid:number) : Promise<Question[]>{
    const questions= await this.manager.find(Question,{where: {date_created : LessThan(date_from), Userid: Userid}, take: 10, relations:["keywords"]});
    if (!questions || questions.length==0)
      throw new NotFoundException(`No questions earlier than date ${date_from} for user with id ${Userid} found.`)
    return questions
  }

  async findOne(id: number) : Promise<Question> {
    const question=await this.manager.findOne(Question, id, {relations:["keywords"]})
    if (!question)
      throw new NotFoundException(`Question with id ${id} not found.`)
    return question
  }

  async findByKeywords(): Promise<Object[]>{
    const quest= await this.keywordRepository.createQueryBuilder("Keyword").leftJoin("Keyword.questions", "questions").loadRelationCountAndMap('Keyword.questionCount', 'Keyword.questions').take(10).getMany()
    if (!quest || !quest.length)
      throw new NotFoundException(`No questions found.`)
    return quest
  }

  async findByKeywordsUser(Userid : number): Promise<Object[]>{

    const quest= await this.keywordRepository.createQueryBuilder("Keyword").leftJoin("Keyword.questions", "questions").where(`questions.Userid=${Userid}`).loadRelationCountAndMap('Keyword.questionCount', 'Keyword.questions').take(10).getMany()

    if (!quest || !quest.length)
      throw new NotFoundException(`No questions for user with id "${Userid}" found.`)
    return quest
  }

  async showPerDay() : Promise<Object[]>{
    const d_to = new Date();
    const date = d_to.toISOString();

    const quest = await createQueryBuilder().select(`EXTRACT(DAY FROM date_created),COUNT(*)` ).from('question', 'Question').andWhere(`date_created <= '${date}'`).andWhere(`date_created >= '${(addMonths(d_to, -1)).toISOString()}'`).groupBy(  `EXTRACT(DAY FROM date_created)`).orderBy('count', 'DESC').take(10).getRawMany()

    //const quest = await this.questionRepository.query(`SELECT ARRAY_AGG(question.id) AS questions, * from Question WHERE date_created <= '${date}' AND date_created >= '${(addMonths(d_to, -1)).toISOString()}' GROUP BY EXTRACT(DAY FROM date_created)`)
    //const quest = await this.questionRepository.query(`SELECT COUNT(qu) ,EXTRACT(DAY FROM date_created) AS day from Question WHERE date_created <= '${date}' AND date_created >= '${(addMonths(d_to, -1)).toISOString()}' GROUP BY EXTRACT(DAY FROM date_created)`)
   // const quest = await entityManager.query(`SELECT * FROM question`)
    if (!quest || !quest.length)
      throw new NotFoundException(`No questions found ths last month.`)
    return quest
  }


  async showPerDayUser(Userid:number) : Promise<Object[]>{
    const d_to = new Date();
    const date = d_to.toISOString();
    const quest = await createQueryBuilder().select(`EXTRACT(DAY FROM date_created) AS day,COUNT(*)` ).from('question', 'Question').andWhere(`date_created <= '${date}'`).andWhere(`date_created >= '${(addMonths(d_to, -1)).toISOString()}'`).andWhere(`Question.Userid=${Userid}`).groupBy(  `EXTRACT(DAY FROM date_created)`).orderBy('count', 'DESC').take(10).getRawMany()
    if (!quest || !quest.length)
      throw new NotFoundException(`No questions found ths last month for user with id ${Userid}.`)
    return quest
  }

  async getMostPopular(): Promise<Question[]>{
    const questions=this.manager.find(Question, {order: {sum_answers : "ASC"}, take : 10})
    if (!questions)
      throw new NotFoundException('No questions found')
    return questions
  }

  async subscribeQuestions (): Promise<string> {
    let sub = await this.client.hget('subscribers', 'questions');
    let subscribers = JSON.parse(sub);
    let myAddress = "http://localhost:8005/view_question/question_message";
    let alreadySubscribed = false;

    if (subscribers == null){
      subscribers = []
      subscribers[0] = myAddress
      await this.client.hset('subscribers', 'questions', JSON.stringify(subscribers));
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
        return "Subscribed to questions";
      }
      else
        return "Already subscribed to questions";
    }
  }

  async subscribeAnswers (): Promise<string> {
    let sub = await this.client.hget('subscribers', 'answers');
    let subscribers = JSON.parse(sub);
    let myAddress = "http://localhost:8005/view_question/answer_message";
    let alreadySubscribed = false;

    if (subscribers == null){
      subscribers = []
      subscribers[0] = myAddress
      await this.client.hset('subscribers', 'answers', JSON.stringify(subscribers));
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
        return "Subscribed to answers";
      }
      else
        return "Already subscribed to answers";
    }
  }

  async updateQuestionDatabases (msgDto : MessageQuestionDto) {
    return this.manager.transaction( async manager=> {
      const question_to_insert = {
        id: msgDto.id,
        title: msgDto.title,
        text: msgDto.text,
        date_created: msgDto.date_created,
        sum_answers: msgDto.sum_answers,
        Userid: msgDto.Userid
      }

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
    });
  }

  async updateSumAnswers (msgDto : MessageAnswerDto): Promise<any> {
    return this.manager.transaction( async updateAnswers => {
      const questionID = msgDto.question["id"];

      const the_update = await this.manager.increment(Question, {id : questionID}, "sum_answers", 1);

      return the_update;
    });
  }

  async retrieveLostQuestionMessages() : Promise<string> {
    let msg = await this.client.hget('questionMessages', 'view_question');
    let messages = JSON.parse(msg);

    if (messages == null || messages == []) {
      await this.client.hset('questionMessages', 'view_question', JSON.stringify(messages));
      return "No lost question messages"
    }
    else {
      for (let i = 0; i < messages.length; i++) {

        await this.manager.transaction(async manager => {
          let question_to_insert = {
            id: messages[i].id,
            title: messages[i].title,
            text: messages[i].text,
            date_created: messages[i].date_created,
            sum_answers: messages[i].sum_answers,
            Userid: messages[i].Userid
          }

          let question = await this.manager.create(Question, question_to_insert);
          await this.manager.save(question)

          if (messages[i].Keywords != []) {
            for (let j = 0; j < (messages[i].Keywords).length; j++) {
              //check if keyword exists
              let keyword_ret = await this.manager.findOne(Keyword, messages[i].Keywords[j])

              if (keyword_ret) {  // keyword exists, add relation
                await getConnection().createQueryBuilder().relation(Keyword, "questions").of(keyword_ret).add(question)

              } else {   //keyword does not exist, we have to create it
                let keyword_to_create = {
                  keyword: messages[i].Keywords[j],
                  questions: [question]
                }
                let keyword = await this.manager.create(Keyword, keyword_to_create)
                await this.manager.save(keyword)
              }
            }
          }
        });

      }

      await this.client.hset('questionMessages', 'view_question', JSON.stringify([]));
      return "Saved data successfully";
    }
  }

  async retrieveLostAnswerMessages() : Promise<string> {
    let msg = await this.client.hget('answerMessages', 'view_question');
    let messages = JSON.parse(msg);

    if (messages == null || messages == []) {
      await this.client.hset('answerMessages', 'view_question', JSON.stringify(messages));
      return "No lost answer messages"
    }
    else {
      for (let i = 0; i < messages.length; i++) {
        let questionID = messages[i].question["id"];

        await this.manager.increment(Question, {id : questionID}, "sum_answers", 1);
      }

      await this.client.hset('answerMessages', 'view_question', JSON.stringify([]));
      return "Saved data successfully";
    }
  }

}
