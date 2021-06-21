import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AnswerModule } from './answer/answer.module';
import { QuestionController } from './question/question.controller';
import { QuestionService } from './question/question.service';
import { QuestionModule } from './question/question.module';

@Module({
  imports: [AnswerModule, QuestionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
