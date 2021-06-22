import {HttpModule, Module} from '@nestjs/common';
import {StatsController} from "./stats.controller";
import {StatsService} from "./stats.service";
import {JwtModule} from "@nestjs/jwt";

@Module({
    imports: [HttpModule,
        JwtModule.register({
        secret: `${process.env.TOKEN_SECRET}`,
        signOptions: {expiresIn : '1d'}
    })
    ],
    controllers: [StatsController],
    providers: [StatsService]
})
export class StatsModule {}

