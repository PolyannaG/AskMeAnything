import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AnswerModule } from './answer/answer.module';
import { QuestionController } from './question/question.controller';
import { QuestionService } from './question/question.service';
import { QuestionModule } from './question/question.module';
import {RedisModule} from "nestjs-redis";

var rtg   = require("url").parse("redis://redistogo:43001732e767859ad9723a153e99288b@soapfish.redistogo.com:11482");
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
