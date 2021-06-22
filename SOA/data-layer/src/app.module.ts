import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule} from "@nestjs/config";
import { StatisticsModule } from './statistics/statistics.module';
import { AnswerModule } from './answer/answer.module';
import { QuestionModule } from './question/question.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [StatisticsModule, AnswerModule, QuestionModule, UsersModule, TypeOrmModule.forRoot(), ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
