import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import {UsersController} from "./users.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Answer} from "../entities/answer.entity";
import {Question} from "../entities/question.entity";
import {Keyword} from "../entities/keyword.entity";
import {User} from "../entities/user.entity";

@Module({
  imports : [TypeOrmModule.forFeature([Answer, Question, Keyword, User])],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
