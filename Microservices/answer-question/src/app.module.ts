import {HttpModule, Module} from '@nestjs/common';
import {AnswerController} from './app.controller';
import {AnswerService} from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Answer} from "./entities/answer.entity";
import {Question} from "./entities/question.entity";
import { ConfigModule} from '@nestjs/config';
import {RedisModule} from "nestjs-redis";
import {JwtModule} from "@nestjs/jwt";

const options={
    port: 6379,
    host: "localhost",
    password: '',
    db: 0
};

@Module({
  imports: [TypeOrmModule.forRoot(),
            ConfigModule.forRoot(),
            TypeOrmModule.forFeature([Answer, Question]),
            HttpModule, 
            RedisModule.register(options),
            JwtModule.register({
              secret: `${process.env.TOKEN_SECRET}`,
              signOptions: {expiresIn : '1d'}

            })
],
  controllers: [AnswerController],
  providers: [AnswerService],
})
export class AppModule {}
