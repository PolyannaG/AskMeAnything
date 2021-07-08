import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { UserModule } from './user/user.module';
import {RedisModule} from "nestjs-redis";

var rtg   = require("url").parse("redis://redistogo:43001732e767859ad9723a153e99288b@soapfish.redistogo.com:11482");
const options={
  port: rtg.port,
  host: rtg.hostname,
  password: rtg.auth.split(":")[1],
};

@Module({
  imports: [AuthenticationModule, UserModule, RedisModule.register(options)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
