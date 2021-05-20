import {HttpModule, Module} from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';

import {TypeOrmModule} from "@nestjs/typeorm";
import {Question} from "./entities/question.entity";
import {Keyword} from "./entities/keyword.entity";
import {JwtModule} from "@nestjs/jwt";

@Module({
  imports: [TypeOrmModule.forFeature([Question, Keyword]),HttpModule],
  controllers: [QuestionController],
  providers: [QuestionService]
})
export class QuestionModule {}
