import {HttpModule, Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import { ConfigModule} from '@nestjs/config';
import {RedisModule} from "nestjs-redis";
import {JwtModule} from "@nestjs/jwt";
import {Answer} from "./entities/answer.entity";
import {Question} from "./entities/question.entity";
import {Keyword} from "./entities/keyword.entity";
import {StatisticsController} from "./stats.controller";
import {StatisticsService} from "./stats.service";

const options={
    port: 6379,
    host: "localhost",
    password: '',
    db: 0
};

@Module({
  imports: [TypeOrmModule.forFeature([Answer, Question, Keyword]),
             JwtModule.register({
                        secret: `${process.env.TOKEN_SECRET}`,
                        signOptions: {expiresIn : '1d'}
                        }),
           HttpModule],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatsModule {}
