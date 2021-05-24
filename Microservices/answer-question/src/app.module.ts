import { Module } from '@nestjs/common';
import {AnswerController} from './app.controller';
import {AnswerService} from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {config} from './orm.config'
import {Answer} from "./entities/answer.entity";
import {Question} from "./entities/question.entity";

@Module({
  imports: [TypeOrmModule.forRoot(config),
    TypeOrmModule.forFeature([Answer, Question])],
  controllers: [AnswerController],
  providers: [AnswerService],
})
export class AppModule {}
