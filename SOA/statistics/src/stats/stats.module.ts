import {HttpModule, Module} from '@nestjs/common';
import {StatsController} from "./stats.controller";
import {StatsService} from "./stats.service";

@Module({
    imports: [HttpModule],
    controllers: [StatsController],
    providers: [StatsService]
})
export class StatsModule {}

