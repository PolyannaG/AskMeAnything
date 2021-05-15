import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuestionModule } from './question/question.module';
import {Migration} from "typeorm";


@Module({
  imports: [QuestionModule, TypeOrmModule.forRoot(), Migration],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
