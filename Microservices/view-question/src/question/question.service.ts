import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectEntityManager, InjectRepository} from "@nestjs/typeorm";
import {createQueryBuilder, EntityManager, LessThan,  Repository} from "typeorm";
import {Question} from "./entities/question.entity";
import {Keyword} from "./entities/keyword.entity";
import {addMonths} from 'date-fns'


@Injectable()
export class QuestionService {

  constructor(@InjectEntityManager() private manager : EntityManager,
              @InjectRepository(Keyword) private readonly keywordRepository : Repository<Keyword>,
             ) {}

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
}
