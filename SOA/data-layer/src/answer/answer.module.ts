import { Module } from '@nestjs/common';
import { AnswerController } from './answer.controller';
import { AnswerService } from './answer.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Answer} from "../entities/answer.entity";
import {Question} from "../entities/question.entity";
import {Keyword} from "../entities/keyword.entity";

@Module({
  imports : [TypeOrmModule.forFeature([Answer, Question, Keyword])],
  controllers: [AnswerController],
  providers: [AnswerService]
})
export class AnswerModule {}
