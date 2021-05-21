import { Module } from '@nestjs/common';
import { ViewAnswerController } from './app.controller';
import { ViewAnswerService } from './app.service';

@Module({
  imports: [],
  controllers: [ViewAnswerController],
  providers: [ViewAnswerService],
})
export class AppModule {}
