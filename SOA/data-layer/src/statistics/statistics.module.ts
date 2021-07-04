import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {StatisticsController} from "./statistics.controller";
import {StatisticsService} from "./statistics.service";
import {Answer} from "../entities/answer.entity";
import {Question} from "../entities/question.entity";
import {Keyword} from "../entities/keyword.entity";


@Module({
    imports : [TypeOrmModule.forFeature([Answer, Question, Keyword])],
    controllers: [StatisticsController],
    providers: [StatisticsService]
})
export class StatisticsModule {}
