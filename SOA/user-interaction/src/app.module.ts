import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AnswerModule } from './answer/answer.module';
import { QuestionController } from './question/question.controller';
import { QuestionService } from './question/question.service';
import { QuestionModule } from './question/question.module';
import {RedisModule} from "nestjs-redis";

const options = {
  port: 6379,
  host: "localhost",
  password: '',
  db: 0
};

@Module({
  imports: [AnswerModule, QuestionModule, RedisModule.register(options)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
