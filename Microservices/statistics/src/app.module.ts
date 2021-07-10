import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import { ConfigModule } from '@nestjs/config';
import {RedisModule} from "nestjs-redis";
import {StatsModule} from "./stats/stats.module";
import {AppService} from "./app.service";
import {AppController} from "./app.controller";


var rtg   = require("url").parse("redis://redistogo:2b2d096b097c82647cb8da45c1e97cc4@soapfish.redistogo.com:11587");
const options={
    port: rtg.port,
    host: rtg.hostname,
    password: rtg.auth.split(":")[1],
};

@Module({
    imports: [StatsModule, TypeOrmModule.forRoot(), ConfigModule.forRoot(),  RedisModule.register(options)],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}