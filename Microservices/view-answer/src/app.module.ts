import { Module } from '@nestjs/common';
import { ViewAnswerController } from './app.controller';
import { ViewAnswerService } from './app.service';
import {Answer} from "./entities/answer.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {JwtModule} from "@nestjs/jwt";

@Module({
  imports: [TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([Answer]),JwtModule.register({
      secret: `${process.env.TOKEN_SECRET}`,
      signOptions: {expiresIn : '1d'}

    })],
  controllers: [ViewAnswerController],
  providers: [ViewAnswerService],
})
export class AppModule {}
