import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuestionModule } from './question/question.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import { ConfigModule } from '@nestjs/config';
import {RedisModule} from "nestjs-redis";

var rtg   = require("url").parse("redis://redistogo:2b2d096b097c82647cb8da45c1e97cc4@soapfish.redistogo.com:11587");
const options={
  port: rtg.port,
  host: rtg.hostname,
  password: rtg.auth.split(":")[1],
};

@Module({
  imports: [QuestionModule, TypeOrmModule.forRoot(), ConfigModule.forRoot(),  RedisModule.register(options)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
