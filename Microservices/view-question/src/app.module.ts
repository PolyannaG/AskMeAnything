import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuestionModule } from './question/question.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
  imports: [QuestionModule, TypeOrmModule.forRoot(), ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
