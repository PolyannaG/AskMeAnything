import {HttpModule, Module} from '@nestjs/common';
import { AnswerService } from './answer.service';
import { AnswerController } from './answer.controller';

@Module({
  imports: [HttpModule],
  providers: [AnswerService],
  controllers: [AnswerController]
})
export class AnswerModule {}
