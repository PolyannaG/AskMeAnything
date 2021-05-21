import { Injectable, NotFoundException } from '@nestjs/common';
import {InjectEntityManager, InjectRepository} from "@nestjs/typeorm"
import {EntityManager, Repository} from "typeorm"
import {CreateAnswerDto} from "./dto/create-answer.dto";
import {Answer} from "./entities/answer.entity";
import {paramIdDto} from "./dto/ParamId.dto";
import {Question} from "./entities/question.entity";

@Injectable()
export class AnswerService {
  constructor(@InjectEntityManager() private manager : EntityManager) {}

  async create (paramId: paramIdDto, createAnswerDto: CreateAnswerDto) : Promise<Answer> {
    return this.manager.transaction( async  manager => {

      const myQuestion = await this.manager.findOne(Question, paramId.id);

      if (!myQuestion)
        throw new NotFoundException(`Question with id ${paramId} not found, so it can't be answered`)

      else {
        const answer_to_be_created = {
          text: createAnswerDto.text,
          userid : createAnswerDto.userid,
          questionId : paramId.id
        }
        const the_answer = await this.manager.create(Answer, answer_to_be_created)
        const answer_created = await this.manager.save(the_answer)

        return answer_created
      }
    });
  }
}
