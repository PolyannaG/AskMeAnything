import {HttpModule, Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import { ConfigModule} from '@nestjs/config';
import {RedisModule} from "nestjs-redis";
import {JwtModule} from "@nestjs/jwt";
import {Answer} from "./entities/answer.entity";
import {Question} from "./entities/question.entity";
import {AnswerController} from "./answer.controller";
import {AnswerService} from "./answer.service";


const options={
    port: 6379,
    host: "localhost",
    password: '',
    db: 0
};

@Module({
  imports: [TypeOrmModule.forFeature([Answer, Question]),
            HttpModule,
            JwtModule.register({
              secret: `${process.env.TOKEN_SECRET}`,
              signOptions: {expiresIn : '1d'}

            })
],
  controllers: [AnswerController],
  providers: [AnswerService],
})
export class AnswerModule {}
