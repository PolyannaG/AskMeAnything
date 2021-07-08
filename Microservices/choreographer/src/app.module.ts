import {HttpModule, Module} from '@nestjs/common';
import { ChoreographerController } from './app.controller';
import { ChoreographerService } from './app.service';
import { RedisModule} from 'nestjs-redis';


var rtg   = require("url").parse(process.env.REDISTOGO_URL);
const options={
    port: rtg.port,
    host: rtg.hostname,
    password: rtg.auth.split(":")[1],
};


@Module({
  imports: [HttpModule, RedisModule.register(options)
  ],
  controllers: [ChoreographerController],
  providers: [ChoreographerService],
})
export class AppModule {}
