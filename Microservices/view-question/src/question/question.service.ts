import {Injectable, NotFoundException} from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import {InjectEntityManager, InjectRepository} from "@nestjs/typeorm";
import {createQueryBuilder, EntityManager, getConnection, getRepository, LessThan, MoreThan, Repository} from "typeorm";
import {Question} from "./entities/question.entity";
import {Keyword} from "./entities/keyword.entity";

@Injectable()
export class QuestionService {

  constructor(@InjectEntityManager() private manager : EntityManager, @InjectRepository(Keyword) private readonly keywordRepository : Repository<Keyword>) {}

  /*
  create(createQuestionDto: CreateQuestionDto) {
    return 'This action adds a new question';
  }
   */

  async findAll(date_from:Date) : Promise<Question[]>{
    return this.manager.find(Question,{where: {date_created : LessThan(date_from)}, take: 10});
  }

  async findOne(id: number) : Promise<Question> {
    const question=await this.manager.findOne(Question, id, {relations:["keywords"]})
    //const question= this.manager.find(Keyword,{relations:["questions"]});
    if (!question)
      throw new NotFoundException(`Question with id ${id} not found.`)
    return question
  }

  async findByKeywords(): Promise<Object[]>{
   /* const keywrd=await this.manager.findOne(Keyword,keyword, {relations:["questions"]})
    if (!keywrd)
      throw new NotFoundException(`No questions with keyword "${keyword}" found.`)
    return keywrd.questions
    */
    const quest= await this.keywordRepository.createQueryBuilder("Keyword").leftJoin("Keyword.questions", "questions").loadRelationCountAndMap('Keyword.questionCount', 'Keyword.questions').take(10).getMany()
    if (!quest || !quest.length)
      throw new NotFoundException(`No questions found.`)
    return quest
  }

  async findByKeywordsUser(Userid : number): Promise<Object[]>{
    /* const keywrd=await this.manager.findOne(Keyword,keyword, {relations:["questions"]})
     if (!keywrd)
       throw new NotFoundException(`No questions with keyword "${keyword}" found.`)
     return keywrd.questions
     */
    const quest= await this.keywordRepository.createQueryBuilder("Keyword").leftJoin("Keyword.questions", "questions").where(`questions.Userid=${Userid}`).loadRelationCountAndMap('Keyword.questionCount', 'Keyword.questions').take(10).getMany()
    if (!quest || !quest.length)
      throw new NotFoundException(`No questions for user with id "${Userid}" found.`)
    return quest
  }

  /*
  update(id: number, updateQuestionDto: UpdateQuestionDto) {
    return `This action updates a #${id} question`;
  }

  remove(id: number) {
    return `This action removes a #${id} question`;
  }

   */
}
