import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import {InjectEntityManager} from "@nestjs/typeorm";
import {EntityManager, getConnection} from "typeorm";
import {Question} from "./entities/question.entity";
import {Keyword} from "./entities/keyword.entity";

@Injectable()
export class QuestionService {

  constructor(@InjectEntityManager() private manager : EntityManager) {}

  async create(createQuestionDto: CreateQuestionDto) : Promise<Question>{
    return this.manager.transaction( async manager=>
    {
      //create question
      const question_to_create = {
        title: createQuestionDto.title,
        text: createQuestionDto.text,
        // date_created: Date.now()
        Userid: createQuestionDto.Userid
      }
      const question = await this.manager.create(Question, question_to_create);
      const question_created = await this.manager.save(question)

      if ('keywords' in createQuestionDto) {
        console.log(createQuestionDto)
        //add keywords:
        for (let i = 0; i < (createQuestionDto.keywords).length; i++) {

          //check if keyword exists
          let keyword_ret = await this.manager.findOne(Keyword, createQuestionDto.keywords[i])
          console.log(keyword_ret)

          if (keyword_ret) {  // keyword exists, add relation
            await getConnection().createQueryBuilder().relation(Keyword, "questions").of(keyword_ret).add(question)

          } else {   //keyword does not exist, we have to create it
            let keyword_to_create = {
              keyword: createQuestionDto.keywords[i],
              questions: [question]
            }
            const keyword = this.manager.create(Keyword, keyword_to_create)
            await this.manager.save(keyword)
          }

        }
      }
    return question_created
    });
  }

  /*
  findAll() {
    return `This action returns all question`;
  }

  findOne(id: number) {
    return `This action returns a #${id} question`;
  }

  update(id: number, updateQuestionDto: UpdateQuestionDto) {
    return `This action updates a #${id} question`;
  }

  remove(id: number) {
    return `This action removes a #${id} question`;
  }
   */
}
