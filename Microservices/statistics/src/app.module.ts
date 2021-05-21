import { Module } from '@nestjs/common';
import { StatisticsController } from './app.controller';
import { StatisticsService } from './app.service';

@Module({
  imports: [],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class AppModule {}
