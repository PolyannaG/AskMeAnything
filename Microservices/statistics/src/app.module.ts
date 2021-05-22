import { Module } from '@nestjs/common';
import { StatisticsController } from './app.controller';
import { StatisticsService } from './app.service';
import {config} from "../../answer-question/src/orm.config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Answer} from "./entities/answer.entity";
import {Question} from "./entities/question.entity";
import {Keyword} from "./entities/keyword.entity";

@Module({
  imports: [TypeOrmModule.forRoot(config),
    TypeOrmModule.forFeature([Answer, Question, Keyword])],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class AppModule {}
