import {Injectable, NotFoundException} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import {createQueryBuilder, EntityManager, LessThan} from "typeorm";
import {Answer} from "./entities/answer.entity";
import {paramIdDto} from "./dto/ParamId.dto";
import {addMonths} from 'date-fns'




@Injectable()
export class ViewAnswerService {
  constructor(@InjectEntityManager() private manager : EntityManager) {}
  
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

/*
  async showAnswerPerDayUser(Userid: number): Promise<Object[]> {
    const d_to = new Date();
    const date = d_to.toISOString();
    const quest = await createQueryBuilder().select(`SUBSTRING(cast(date_created as varchar),0,11)  as date_part,COUNT(*)`).from('Answer', 'Answer').andWhere(`date_created <= '${date}'`).andWhere(`date_created >= '${(addMonths(d_to, -1)).toISOString()}'`).andWhere(`"Answer"."userid"=${Userid}`).groupBy(`SUBSTRING(cast(date_created as varchar),0,11)`).orderBy('count', 'DESC').take(10).getRawMany()
    if (!quest || !quest.length)
      throw new NotFoundException(`No answers found ths last month for user with id ${Userid}.`)
    return quest
  }

  async countAnswersUser(Userid: number): Promise<Object[]>{
    const quest=await this.manager.query(`SELECT COUNT(*) FROM "view_answer"."answer" as A WHERE A."userid"=${Userid}`)
    if (!quest || !quest.length)
      throw new NotFoundException(`No answers found for user with id ${Userid}.`)
    return quest
  }

 */

}
