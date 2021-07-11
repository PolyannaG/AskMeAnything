import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StatsModule } from './stats/stats.module';
import {RedisModule} from "nestjs-redis";

var rtg   = require("url").parse("redis://redistogo:9b4ebaba46ff3777eb0b7162f4c96fc8@soapfish.redistogo.com:11555");
const options={
    port: rtg.port,
    host: rtg.hostname,
    password: rtg.auth.split(":")[1],
};

@Module({
  imports: [StatsModule, RedisModule.register(options)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
