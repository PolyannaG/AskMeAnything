import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectEntityManager, InjectRepository} from "@nestjs/typeorm";
import {createQueryBuilder, EntityManager,  Repository} from "typeorm";
import {Keyword} from "./entities/keyword.entity";
import {addMonths} from 'date-fns'

@Injectable()
export class StatisticsService {

  constructor(@InjectEntityManager() private manager : EntityManager,
              @InjectRepository(Keyword) private readonly keywordRepository : Repository<Keyword>,
  ) {}

  async findByKeywords(): Promise<Object[]> {
    // const quest= await this.keywordRepository.createQueryBuilder("Keyword").leftJoin("Keyword.questions", "questions").loadRelationCountAndMap('Keyword.questionCount', 'Keyword.questions').take(10).getMany()
    //const quest= await createQueryBuilder().select('COUNT(*) as questionCount, keywordKeyword as keyword').from('keyword_questions_question','keyword_questions_question').groupBy('keyword_questions_question.keywordKeyword').orderBy('count', 'DESC').take(10).getRawMany()
    const quest = await createQueryBuilder().select('COUNT(*) as questionCount, keyword_questions_question.keywordKeyword as keyword').from('keyword_questions_question', 'keyword_questions_question').groupBy('keyword_questions_question.keywordKeyword').orderBy('questionCount', 'DESC').take(10).getRawMany()

    if (!quest || !quest.length)
      throw new NotFoundException(`No questions found.`)
    return quest
  }

  async findByKeywordsUser(Userid: number): Promise<Object[]> {

    const quest= await this.manager.query(`SELECT COUNT(*) as "questionCount", "C"."keywordKeyword" as "keyword" FROM (SELECT * from  "statistics"."keyword_questions_question" as "A"  INNER JOIN "statistics"."question" as "B" ON "A"."questionId"="B"."id" WHERE "B"."Userid"=${Userid}) as "C"  GROUP BY "C"."keywordKeyword"`)

    if (!quest || !quest.length)
      throw new NotFoundException(`No questions for user with id "${Userid}" found.`)

    return quest
  }

  async showQuestionsPerDay(): Promise<Object[]> {
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


  async showQuestionsPerDayUser(Userid:number) : Promise<Object[]>{
    const d_to = new Date();
    const date = d_to.toISOString();
    const quest = await createQueryBuilder().select(`SUBSTRING(cast(date_created as varchar),0,11)  as date_part,COUNT(*)`).from('question', 'Question').andWhere(`date_created <= '${date}'`).andWhere(`date_created >= '${(addMonths(d_to, -1)).toISOString()}'`).andWhere(`Question.Userid=${Userid}`).groupBy(`SUBSTRING(cast(date_created as varchar),0,11)`).orderBy('count', 'DESC').take(10).getRawMany()
    if (!quest || !quest.length)
      throw new NotFoundException(`No questions found ths last month for user with id ${Userid}.`)
    return quest

  }

  async showAnswersPerDay() : Promise<Object[]>{
    const d_to = new Date();
    const date = d_to.toISOString();

    const ans = await createQueryBuilder().select(`EXTRACT(DAY FROM date_created),COUNT(*)` ).from('answer', 'Answer').andWhere(`date_created <= '${date}'`).andWhere(`date_created >= '${(addMonths(d_to, -1)).toISOString()}'`).groupBy(  `EXTRACT(DAY FROM date_created)`).orderBy('count', 'DESC').take(10).getRawMany()

    if (!ans || !ans.length)
      throw new NotFoundException(`No answers found this last month.`)
    return ans
  }


  async showAnswersPerDayUser(Userid: number): Promise<Object[]> {
    const d_to = new Date();
    const date = d_to.toISOString();
    const quest = await createQueryBuilder().select(`SUBSTRING(cast(date_created as varchar),0,11)  as date_part,COUNT(*)`).from('Answer', 'Answer').andWhere(`date_created <= '${date}'`).andWhere(`date_created >= '${(addMonths(d_to, -1)).toISOString()}'`).andWhere(`"Answer"."Userid"=${Userid}`).groupBy(`SUBSTRING(cast(date_created as varchar),0,11)`).orderBy('count', 'DESC').take(10).getRawMany()
    if (!quest || !quest.length)
      throw new NotFoundException(`No answers found ths last month for user with id ${Userid}.`)
    return quest
  }

  async countAnswersUser(Userid: number): Promise<Object[]>{
    const quest=await this.manager.query(`SELECT COUNT(*) FROM "statistics"."answer" as A WHERE A."Userid"=${Userid}`)
    if (!quest || !quest.length)
      throw new NotFoundException(`No answers found for user with id ${Userid}.`)
    return quest
  }

  async countQuestionsUser(Userid: number): Promise<Object[]>{
    const quest=await this.manager.query(`SELECT COUNT(*) FROM "statistics"."question" as A WHERE A."Userid"=${Userid}`)
    if (!quest || !quest.length)
      throw new NotFoundException(`No questions found for user with id ${Userid}.`)
    return quest
  }

}
