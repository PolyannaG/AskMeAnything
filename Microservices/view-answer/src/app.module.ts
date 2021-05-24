import { Module } from '@nestjs/common';
import { ViewAnswerController } from './app.controller';
import { ViewAnswerService } from './app.service';
import {config} from "./orm.config";
import {Answer} from "./entities/answer.entity";
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forRoot(config),
    TypeOrmModule.forFeature([Answer])],
  controllers: [ViewAnswerController],
  providers: [ViewAnswerService],
})
export class AppModule {}
