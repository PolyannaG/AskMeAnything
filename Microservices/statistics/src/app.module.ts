import { Module } from '@nestjs/common';
import { StatisticsController } from './app.controller';
import { StatisticsService } from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Answer} from "./entities/answer.entity";
import {Question} from "./entities/question.entity";
import {Keyword} from "./entities/keyword.entity";
import {JwtModule} from "@nestjs/jwt";

@Module({
  imports: [TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([Answer, Question, Keyword]) ,JwtModule.register({
      secret: `${process.env.TOKEN_SECRET}`,
      signOptions: {expiresIn : '1d'}

    })],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class AppModule {}
