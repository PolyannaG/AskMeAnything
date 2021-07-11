import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AnswerModule } from './answer/answer.module';
import { QuestionController } from './question/question.controller';
import { QuestionService } from './question/question.service';
import { QuestionModule } from './question/question.module';
import {RedisModule} from "nestjs-redis";

var rtg   = require("url").parse("redis://redistogo:9b4ebaba46ff3777eb0b7162f4c96fc8@soapfish.redistogo.com:11555");
const options={
  port: rtg.port,
  host: rtg.hostname,
  password: rtg.auth.split(":")[1],
};

@Module({
  imports: [AnswerModule, QuestionModule, RedisModule.register(options)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
