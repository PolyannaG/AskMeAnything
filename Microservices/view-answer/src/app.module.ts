import {HttpModule, Module} from '@nestjs/common';
import { ViewAnswerController } from './app.controller';
import { ViewAnswerService } from './app.service';
import {Answer} from "./entities/answer.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import { ConfigModule} from '@nestjs/config';
import {RedisModule} from "nestjs-redis";

const options={
  port: 6379,
  host: "localhost",
  password: '',
  db: 0
};

@Module({
  imports: [TypeOrmModule.forRoot(), ConfigModule.forRoot(), TypeOrmModule.forFeature([Answer]), RedisModule.register(options), HttpModule],
  controllers: [ViewAnswerController],
  providers: [ViewAnswerService],
})
export class AppModule {}
