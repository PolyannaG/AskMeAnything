import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import { AuthenticationModule } from './authentication/authentication.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {RedisModule} from "nestjs-redis";
import Joi from "joi";

var rtg   = require("url").parse("redis://redistogo:2b2d096b097c82647cb8da45c1e97cc4@soapfish.redistogo.com:11587");
const options={
  port: rtg.port,
  host: rtg.hostname,
  password: rtg.auth.split(":")[1],
};

@Module({
  imports: [UserModule, TypeOrmModule.forRoot(), AuthenticationModule, ConfigModule.forRoot(), RedisModule.register(options)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
