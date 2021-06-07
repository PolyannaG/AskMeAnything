import {HttpModule, Module} from '@nestjs/common';
import {AnswerController} from './app.controller';
import {AnswerService} from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Answer} from "./entities/answer.entity";
import {Question} from "./entities/question.entity";
import { ConfigModule} from '@nestjs/config';
import {RedisModule} from "nestjs-redis";

const options={
    port: 6379,
    host: "localhost",
    password: '',
    db: 0
};

@Module({
  imports: [TypeOrmModule.forRoot(), ConfigModule.forRoot(), TypeOrmModule.forFeature([Answer, Question]), HttpModule, RedisModule.register(options)],
  controllers: [AnswerController],
  providers: [AnswerService],
})
export class AppModule {}
