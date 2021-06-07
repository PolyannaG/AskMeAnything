import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectConnection, InjectEntityManager, InjectRepository} from "@nestjs/typeorm";
import {Connection, createQueryBuilder, EntityManager, LessThan, Repository} from "typeorm";
import {Question} from "./entities/question.entity";
import {Keyword} from "./entities/keyword.entity";
import {addMonths} from 'date-fns'


@Injectable()
export class QuestionService {

  constructor(@InjectEntityManager() private manager: EntityManager,
              @InjectRepository(Keyword) private readonly keywordRepository: Repository<Keyword>,
              @InjectRepository(Keyword) private readonly que: Repository<Keyword>
  ) {
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
/*
  async findByKeywords(): Promise<Object[]> {
    // const quest= await this.keywordRepository.createQueryBuilder("Keyword").leftJoin("Keyword.questions", "questions").loadRelationCountAndMap('Keyword.questionCount', 'Keyword.questions').take(10).getMany()
    //const quest= await createQueryBuilder().select('COUNT(*) as questionCount, keywordKeyword as keyword').from('keyword_questions_question','keyword_questions_question').groupBy('keyword_questions_question.keywordKeyword').orderBy('count', 'DESC').take(10).getRawMany()
    const quest = await createQueryBuilder().select('COUNT(*) as questionCount, keyword_questions_question.keywordKeyword as keyword').from('keyword_questions_question', 'keyword_questions_question').groupBy('keyword_questions_question.keywordKeyword').orderBy('questionCount', 'DESC').take(10).getRawMany()

    if (!quest || !quest.length)
      throw new NotFoundException(`No questions found.`)
    return quest
  }

  async findByKeywordsUser(Userid: number): Promise<Object[]> {

   // let quest = await createQueryBuilder("Keyword").leftJoin("Keyword.questions", "questions").where(`questions.Userid=${Userid}`).loadRelationCountAndMap('Keyword.questionCount', 'Keyword.questions').getMany()

    // const quest= await createQueryBuilder().select('COUNT(*) as questionCount, keyword_questions.keywordKeyword as keyword').from('keyword_questions_question','keyword_questions_question').innerJoin('question', 'keyword_questions','question.id=keyword_questions_question.questionId').where(`keyword_questions_question.Userid=${Userid}`).groupBy('keyword_questions.keywordKeyword').orderBy('questionCount', 'DESC').take(10).getRawMany()
      const quest= await this.manager.query(`SELECT COUNT(*) as "questionCount", "C"."keywordKeyword" as "keyword" FROM (SELECT * from  "view_question"."keyword_questions_question" as "A"  INNER JOIN "view_question"."question" as "B" ON "A"."questionId"="B"."id" WHERE "B"."Userid"=${Userid}) as "C"  GROUP BY "C"."keywordKeyword"`)
   //  const quest= await this.connection.query('SELECT * FROM (SELECT * from  "keyword_questions_question" as "A"  INNER JOIN "question" as "B" ON "A"."questionId"="B"."id") as "C" ')
    // @ts-ignore
    //const quest= await createQueryBuilder().select('COUNT(*) as "questionCount", "keywordKeyword" as "keyword"').from("keyword_questions_question" , "A" ).innerJoin('question',  'B','"A"."questionId"="B"."id"').groupBy('keyword_questions_question.keywordKeyword').orderBy('"B"."questionCount"', 'DESC').take(10).getRawMany()


    if (!quest || !quest.length)
      throw new NotFoundException(`No questions for user with id "${Userid}" found.`)

  //  quest.sort()
   // if (quest.length > 10) {
  //    quest = quest.slice(0, 10)
  //  }

    return quest
  }

  async showPerDay(): Promise<Object[]> {
    const d_to = new Date();
    const date = d_to.toISOString();

    const quest = await createQueryBuilder().select(`SUBSTRING(cast(date_created as varchar),0,11)  as date_part,COUNT(*)`).from('question', 'Question').andWhere(`date_created <= '${date}'`).andWhere(`date_created >= '${(addMonths(d_to, -1)).toISOString()}'`).groupBy(`SUBSTRING(cast(date_created as varchar),0,11)`).orderBy('count', 'DESC').take(10).getRawMany()

    //const quest = await this.questionRepository.query(`SELECT ARRAY_AGG(question.id) AS questions, * from Question WHERE date_created <= '${date}' AND date_created >= '${(addMonths(d_to, -1)).toISOString()}' GROUP BY EXTRACT(DAY FROM date_created)`)
    //const quest = await this.questionRepository.query(`SELECT COUNT(qu) ,EXTRACT(DAY FROM date_created) AS day from Question WHERE date_created <= '${date}' AND date_created >= '${(addMonths(d_to, -1)).toISOString()}' GROUP BY EXTRACT(DAY FROM date_created)`)
    // const quest = await entityManager.query(`SELECT * FROM question`)
    if (!quest || !quest.length)
      throw new NotFoundException(`No questions found ths last month.`)
    return quest
  }


  async showPerDayUser(Userid: number): Promise<Object[]> {
    const d_to = new Date();
    const date = d_to.toISOString();
    const quest = await createQueryBuilder().select(`SUBSTRING(cast(date_created as varchar),0,11)  as date_part,COUNT(*)`).from('question', 'Question').andWhere(`date_created <= '${date}'`).andWhere(`date_created >= '${(addMonths(d_to, -1)).toISOString()}'`).andWhere(`Question.Userid=${Userid}`).groupBy(`SUBSTRING(cast(date_created as varchar),0,11)`).orderBy('count', 'DESC').take(10).getRawMany()
    if (!quest || !quest.length)
      throw new NotFoundException(`No questions found ths last month for user with id ${Userid}.`)
    return quest
  }

 */

  async getMostPopular(): Promise<Question[]> {
    const questions = this.manager.find(Question, {order: {date_created: "DESC"}, take: 10, relations: ["keywords"]})
    if (!questions)
      throw new NotFoundException('No questions found')
    return questions
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

  /*
  async countQuestionsUser(Userid: number): Promise<Object[]>{
    const quest=await this.manager.query(`SELECT COUNT(*) FROM "view_question"."question" as A WHERE A."Userid"=${Userid}`)
    if (!quest || !quest.length)
      throw new NotFoundException(`No questions found for user with id ${Userid}.`)
    return quest
  }
*/


}