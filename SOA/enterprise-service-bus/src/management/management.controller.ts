import {Body, Controller, Get, Post} from '@nestjs/common';
import {ManagementService} from "./management.service";
import {ManagementBodyDto} from "./dto/management-body.dto";

@Controller('management')
export class ManagementController {
    constructor(private readonly managementService : ManagementService) {}

    async onModuleInit() {
        return this.managementService.updateSubscribers()
    }

    @Post('subscribe')
    ActivateSubscription(@Body() sub: ManagementBodyDto){
        return this.managementService.activateSubscription(sub)
    }

    @Post('unsubscribe')
    StopSubscription(@Body() sub: ManagementBodyDto){
        return this.managementService.stopSubscription(sub)
    }

    @Get('allRegistered')
    GetAllSubscribers(){
        return this.managementService.getAllSubscribers()
    }
}
