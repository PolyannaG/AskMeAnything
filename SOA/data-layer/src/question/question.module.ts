import { Module } from '@nestjs/common';
import { QuestionController } from './question.controller';
import {QuestionService} from "./question.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Answer} from "../entities/answer.entity";
import {Question} from "../entities/question.entity";
import {Keyword} from "../entities/keyword.entity";

@Module({
  imports : [TypeOrmModule.forFeature([Answer, Question, Keyword])],
  controllers: [QuestionController],
  providers: [QuestionService]
})
export class QuestionModule {}
