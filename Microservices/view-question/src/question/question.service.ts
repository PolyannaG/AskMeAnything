import {Injectable, NotFoundException} from '@nestjs/common';
import {createQueryBuilder, Connection, EntityManager, getConnection, LessThan, Repository} from "typeorm";
import {InjectConnection, InjectEntityManager, InjectRepository} from "@nestjs/typeorm";
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
              @InjectRepository(Keyword) private readonly que: Repository<Keyword>,
              private redisService: RedisService) {
    this.getClient();
  }

  private async getClient() {
    this.client = await this.redisService.getClient();
  }

  async findAll(date_from: Date): Promise<Question[]> {
    const questions = await this.manager.find(Question, {
      where: {date_created: LessThan(date_from)},
      order: {
        date_created: "DESC",
      },
      take: 10,
      relations: ["keywords"]
    });
    if (!questions || questions.length == 0)
      throw new NotFoundException(`No questions earlier than date ${date_from} found.`)
    return questions
  }

  async findAllTitles(): Promise<Question[]> {
    const titles=await this.manager.query(`SELECT title , id FROM view_question.question`)
    if (!titles || titles.length == 0)
      throw new NotFoundException(`No questions earlier found.`)
    return titles
  }

  async findAllUser(date_from: Date, Userid: number): Promise<Question[]> {
    const questions = await this.manager.find(Question, {
      where: {date_created: LessThan(date_from), Userid: Userid},
      take: 10,
      relations: ["keywords"]
    });
    if (!questions || questions.length == 0)
      throw new NotFoundException(`No questions earlier than date ${date_from} for user with id ${Userid} found.`)
    return questions
  }

  async findOne(id: number): Promise<Question[]> {
    const question = await this.manager.findOne(Question, id, {relations: ["keywords"]})
    if (!question)
      throw new NotFoundException(`Question with id ${id} not found.`)
    return [question]
  }

  async getMostPopular(): Promise<Question[]> {
    const questions = this.manager.find(Question, {order: {date_created: "DESC"}, take: 10, relations: ["keywords"]})
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

  async filterByStartAndEndDate(date_from: Date, date_to: Date): Promise<Question[]> {
    const questions = await createQueryBuilder().select(`*`).from('question', 'Question').andWhere(`date_created < '${date_from}'`).andWhere(`date_created >= '${date_to}'`).orderBy('date_created', 'DESC').take(10).getRawMany()
    if (!questions || questions.length == 0)
      throw new NotFoundException(`No questions earlier than date ${date_from} and later than date ${date_to} found.`)

    for (let i = 0; i < questions.length; i++) {
      let keyw = await this.manager.findOne(Question, questions[i].id, {relations: ["keywords"]})
      questions[i].keywords = keyw.keywords
    }
    return questions
  }

  async filterByStartAndEndDateUser(date_from: Date, date_to: Date, Userid : number): Promise<Question[]> {
    const questions = await createQueryBuilder().select(`*`).from('question', 'Question').andWhere(`date_created < '${date_from}'`).andWhere(`date_created >= '${date_to}'`).andWhere(`"Userid" = ${Userid}`).orderBy('date_created', 'DESC').take(10).getRawMany()
    if (!questions || questions.length == 0)
      throw new NotFoundException(`No questions earlier than date ${date_from} and later than date ${date_to} and user id ${Userid} found .`)

    for (let i = 0; i < questions.length; i++) {
      let keyw = await this.manager.findOne(Question, questions[i].id, {relations: ["keywords"]})
      questions[i].keywords = keyw.keywords
    }
    return questions
  }


  async filterByKeywordDateFrom(keyword: String, date_from: Date): Promise<Object[]> {

    //let quest = await createQueryBuilder("Question").leftJoin("Question.keywords", "questions",'"questionID"="id"').where(`date_created <= '${date_from}'`).getMany()

    const quest= await this.manager.query(`SELECT * FROM (SELECT * from  "view_question"."keyword_questions_question" as "A"  INNER JOIN "view_question"."question" as "B" ON "A"."questionId"="B"."id" WHERE "B"."date_created"<'${date_from}' AND "A"."keywordKeyword"='${keyword}') as "C" ORDER BY "C"."date_created" DESC LIMIT 10`)

    if (!quest || !quest.length)
      throw new NotFoundException(`No questions found for keyword ${keyword} and before ${date_from}.`)

    for (let i = 0; i < quest.length; i++) {
      let keyw = await this.manager.findOne(Question, quest[i].id, {relations: ["keywords"]})
      quest[i].keywords = keyw.keywords
    }

    return quest
  }

  async filterByKeywordDateFromUser(keyword: String, date_from: Date, Userid : number): Promise<Object[]> {

    //let quest = await createQueryBuilder("Question").leftJoin("Question.keywords", "questions",'"questionID"="id"').where(`date_created <= '${date_from}'`).getMany()

    const quest= await this.manager.query(`SELECT * FROM (SELECT * from  "view_question"."keyword_questions_question" as "A"  INNER JOIN "view_question"."question" as "B" ON "A"."questionId"="B"."id" WHERE "B"."date_created"<'${date_from}' AND "A"."keywordKeyword"='${keyword}' AND "B"."Userid"=${Userid}) as "C" ORDER BY "C"."date_created" DESC LIMIT 10`)

    if (!quest || !quest.length)
      throw new NotFoundException(`No questions found for keyword ${keyword} and before ${date_from} and user id ${Userid}.`)

    for (let i = 0; i < quest.length; i++) {
      let keyw = await this.manager.findOne(Question, quest[i].id, {relations: ["keywords"]})
      quest[i].keywords = keyw.keywords
    }

    return quest
  }

  async filterByKeywordDateFromTo(keyword: String, date_from: Date, date_to : Date): Promise<Object[]> {

    //let quest = await createQueryBuilder("Question").leftJoin("Question.keywords", "questions",'"questionID"="id"').where(`date_created <= '${date_from}'`).getMany()

    const quest= await this.manager.query(`SELECT * FROM (SELECT * from  "view_question"."keyword_questions_question" as "A"  INNER JOIN "view_question"."question" as "B" ON "A"."questionId"="B"."id" WHERE "B"."date_created"<'${date_from}' AND "B"."date_created">='${date_to}' AND "A"."keywordKeyword"='${keyword}') as "C" ORDER BY "C"."date_created" DESC LIMIT 10`)

    if (!quest || !quest.length)
      throw new NotFoundException(`No questions found for keyword ${keyword} and before ${date_from} and after ${date_to}.`)

    for (let i = 0; i < quest.length; i++) {
      let keyw = await this.manager.findOne(Question, quest[i].id, {relations: ["keywords"]})
      quest[i].keywords = keyw.keywords
    }

    return quest
  }

  async filterByKeywordDateFromToUser(keyword: String, date_from: Date,  date_to : Date, Userid : number): Promise<Object[]> {

    //let quest = await createQueryBuilder("Question").leftJoin("Question.keywords", "questions",'"questionID"="id"').where(`date_created <= '${date_from}'`).getMany()

    const quest= await this.manager.query(`SELECT * FROM (SELECT * from  "view_question"."keyword_questions_question" as "A"  INNER JOIN "view_question"."question" as "B" ON "A"."questionId"="B"."id" WHERE "B"."date_created"< '${date_from}' AND "B"."date_created">='${date_to}' AND "A"."keywordKeyword"='${keyword}' AND "B"."Userid"=${Userid}) as "C" ORDER BY "C"."date_created" DESC LIMIT 10`)

    if (!quest || !quest.length)
      throw new NotFoundException(`No questions found for keyword ${keyword} and before ${date_from} and after ${date_to} and user id ${Userid}.`)

    for (let i = 0; i < quest.length; i++) {
      let keyw = await this.manager.findOne(Question, quest[i].id, {relations: ["keywords"]})
      quest[i].keywords = keyw.keywords
    }

    return quest
  }

  async findAllKeywords(): Promise<Keyword[]>{
    const keyw=await this.manager.query('SELECT * FROM view_question.keyword ORDER BY keyword')
    if (!keyw || !keyw.length)
      throw new NotFoundException(`No keywords found.`)
    return keyw

  }

  async findSpecificKeywords(keyword: String): Promise<Keyword[]>{
    const keyw=await this.manager.query(`SELECT * FROM view_question.keyword AS A WHERE A.keyword LIKE '%${keyword}%' ORDER BY keyword`)
    if (!keyw || !keyw.length)
      throw new NotFoundException(`No keywords found.`)
    return keyw

  }

}

