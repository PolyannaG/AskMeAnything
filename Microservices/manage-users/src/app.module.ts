import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import { AuthenticationModule } from './authentication/authentication.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {RedisModule} from "nestjs-redis";
import Joi from "joi";

const options={
  port: 6379,
  host: "localhost",
  password: '',
  db: 0
};

@Module({
  imports: [UserModule, TypeOrmModule.forRoot(), AuthenticationModule, ConfigModule.forRoot(), RedisModule.register(options)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
