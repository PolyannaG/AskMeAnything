import { Module } from '@nestjs/common';
import {AnswerController} from './app.controller';
import {AnswerService} from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Answer} from "./entities/answer.entity";
import {Question} from "./entities/question.entity";
import {JwtModule} from "@nestjs/jwt";

@Module({
  imports: [TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([Answer, Question]),
    JwtModule.register({
      secret: `${process.env.TOKEN_SECRET}`,
      signOptions: {expiresIn : '1d'}

    })],
  controllers: [AnswerController],
  providers: [AnswerService],
})
export class AppModule {}
