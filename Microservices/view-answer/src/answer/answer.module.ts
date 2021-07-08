import {HttpModule, Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import { ConfigModule} from '@nestjs/config';
import {RedisModule} from "nestjs-redis";
import {JwtModule} from "@nestjs/jwt";
import {ViewAnswerService} from "./answer.service";
import {ViewAnswerController} from "./answer.controller";
import {Answer} from "./entities/answer.entity";


@Module({
  imports: [TypeOrmModule.forFeature([Answer]),
             JwtModule.register({
                        secret: `${process.env.TOKEN_SECRET}`,
                        signOptions: {expiresIn : '1d'}
                        })
           , HttpModule],
  controllers: [ViewAnswerController],
  providers: [ViewAnswerService],
})
export class AnswerModule {}
