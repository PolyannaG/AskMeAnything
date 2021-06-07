import {HttpModule, Module} from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Question} from "./entities/question.entity";
import {Keyword} from "./entities/keyword.entity";
import {JwtModule} from "@nestjs/jwt";
import {RedisModule} from "nestjs-redis";

@Module({
  imports: [TypeOrmModule.forFeature([Question, Keyword]), HttpModule
      /*JwtModule.register({
            secret: `${process.env.TOKEN_SECRET}`,
            signOptions: {expiresIn : '1d'}
            })*/
  ],
  controllers: [QuestionController],
  providers: [QuestionService]
})
export class QuestionModule {}
