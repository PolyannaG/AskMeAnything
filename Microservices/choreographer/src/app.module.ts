import {HttpModule, Module} from '@nestjs/common';
import { ChoreographerController } from './app.controller';
import { ChoreographerService } from './app.service';
import { RedisModule} from 'nestjs-redis';

@Module({
  imports: [HttpModule, RedisModule.register({
                                  port: 6379,
                                  host: "localhost",
                                  password: '',
                                  db: 0
                                })
  ],
  controllers: [ChoreographerController],
  providers: [ChoreographerService],
})
export class AppModule {}
