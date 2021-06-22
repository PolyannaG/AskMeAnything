import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {RedisModule} from "nestjs-redis";
import { ManagementController } from './management/management.controller';
import { DiscoveryController } from './discovery/discovery.controller';
import { ExecutionController } from './execution/execution.controller';
import { ExecutionService } from './execution/execution.service';
import { DiscoveryService } from './discovery/discovery.service';
import { ManagementService } from './management/management.service';

const options = {
  port: 6379,
  host: "localhost",
  password: '',
  db: 0
};

@Module({
  imports: [RedisModule.register(options)],
  controllers: [AppController, ManagementController, DiscoveryController, ExecutionController],
  providers: [AppService, ExecutionService, DiscoveryService, ManagementService],
})
export class AppModule {}
