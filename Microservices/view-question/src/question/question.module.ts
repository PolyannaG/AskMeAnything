import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';

import {TypeOrmModule} from "@nestjs/typeorm";
import {Question} from "./entities/question.entity";
import {Keyword} from "./entities/keyword.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Question, Keyword])],
  controllers: [QuestionController],
  providers: [QuestionService]
})
export class QuestionModule {}
