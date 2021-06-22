import {HttpModule, Module} from '@nestjs/common';
import {QuestionController} from "./question.controller";
import {QuestionService} from "./question.service";
import {JwtModule} from "@nestjs/jwt";

@Module({
    imports: [HttpModule,
        JwtModule.register({
        secret: `${process.env.TOKEN_SECRET}`,
        signOptions: {expiresIn : '1d'}
    })
    ],
    controllers: [QuestionController],
    providers: [QuestionService]
})
export class QuestionModule {}
