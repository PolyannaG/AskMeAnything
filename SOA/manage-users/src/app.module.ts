import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { UserModule } from './user/user.module';
import {RedisModule} from "nestjs-redis";

const options = {
  port: 6379,
  host: "localhost",
  password: '',
  db: 0
};

@Module({
  imports: [AuthenticationModule, UserModule, RedisModule.register(options)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
