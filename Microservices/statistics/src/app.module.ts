import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import { ConfigModule } from '@nestjs/config';
import {RedisModule} from "nestjs-redis";
import {StatsModule} from "./stats/stats.module";
import {AppService} from "./app.service";
import {AppController} from "./app.controller";


const options={
    port: 6379,
    host: "localhost",
    password: '',
    db: 0
};

@Module({
    imports: [StatsModule, TypeOrmModule.forRoot(), ConfigModule.forRoot(),  RedisModule.register(options)],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}