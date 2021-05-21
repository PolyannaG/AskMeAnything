import {Injectable, NotFoundException} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import {EntityManager} from "typeorm";
import {Answer} from "./entities/answer.entity";
import {Question} from "../../answer-question/src/entities/question.entity";
import {paramIdDto} from "./dto/ParamId.dto";


@Injectable()
export class ViewAnswerService {
  constructor(@InjectEntityManager() private manager : EntityManager) {}
  
  async findQuestionAnswers(QuestionID : paramIdDto): Promise<Object[]> {
    const myQuestion = await this.manager.findOne(Question, QuestionID);

    if (!myQuestion)
      throw new NotFoundException(`Question with id ${QuestionID} not found, so it can't be answered`)

    else {
      const question_answers = await this.manager.find(Answer, {where: {questionId: QuestionID.id}});
      if (!question_answers)
        return [
          {
            id: QuestionID,
            answers: []
          }
        ];

      else
        return question_answers;
    }
  }

  async findAnswersForUser(UserID : paramIdDto): Promise<Object[]> {
    const my_answers = await this.manager.find(Answer, {where: {userid: UserID.id}});
    if (!my_answers)
      return [
        {
          userID: UserID,
          answers: []
        }
      ];

    else
      return my_answers;
  }
}