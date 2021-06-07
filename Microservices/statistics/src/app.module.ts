import { Module } from '@nestjs/common';
import { StatisticsController } from './app.controller';
import { StatisticsService } from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Answer} from "./entities/answer.entity";
import {Question} from "./entities/question.entity";
import {Keyword} from "./entities/keyword.entity";
import { ConfigModule} from '@nestjs/config';
import {RedisModule} from "nestjs-redis";

const options={
    port: 6379,
    host: "localhost",
    password: '',
    db: 0
};

@Module({
  imports: [TypeOrmModule.forRoot(), ConfigModule.forRoot(), TypeOrmModule.forFeature([Answer, Question, Keyword]), RedisModule.register(options)],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class AppModule {}
