import {HttpModule, Module} from '@nestjs/common';
import { AnswerService } from './answer.service';
import { AnswerController } from './answer.controller';
import {JwtModule} from "@nestjs/jwt";

@Module({
  imports: [HttpModule,
    JwtModule.register({
    secret: `${process.env.TOKEN_SECRET}`,
    signOptions: {expiresIn : '1d'}
  })
  ],
  providers: [AnswerService],
  controllers: [AnswerController]
})
export class AnswerModule {}
