import {HttpModule, Module} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {RedisModule} from "nestjs-redis";
import { ManagementController } from './management/management.controller';
import { DiscoveryController } from './discovery/discovery.controller';
import { ExecutionController } from './execution/execution.controller';
import { ExecutionService } from './execution/execution.service';
import { DiscoveryService } from './discovery/discovery.service';
import { ManagementService } from './management/management.service';

var rtg   = require("url").parse("redis://redistogo:9b4ebaba46ff3777eb0b7162f4c96fc8@soapfish.redistogo.com:11555");
const options={
  port: rtg.port,
  host: rtg.hostname,
  password: rtg.auth.split(":")[1],
};


@Module({
  imports: [RedisModule.register(options), HttpModule],
  controllers: [AppController, ManagementController, DiscoveryController, ExecutionController],
  providers: [AppService, ExecutionService, DiscoveryService, ManagementService],
})
export class AppModule {}
