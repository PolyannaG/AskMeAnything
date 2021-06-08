import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import { ConfigModule } from '@nestjs/config';
import {RedisModule} from "nestjs-redis";
import {AnswerModule} from "./answer/answer.module";

const options={
    port: 6379,
    host: "localhost",
    password: '',
    db: 0
};

@Module({
    imports: [AnswerModule, TypeOrmModule.forRoot(), ConfigModule.forRoot(),  RedisModule.register(options)],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
