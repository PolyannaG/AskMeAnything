import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuestionModule } from './question/question.module';
import { ConfigModule} from '@nestjs/config';
import {RedisModule} from "nestjs-redis";

const options={
  port: 6379,
  host: "localhost",
  password: '',
  db: 0
};

@Module({
  imports: [QuestionModule, TypeOrmModule.forRoot(), ConfigModule.forRoot(), RedisModule.register(options)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
