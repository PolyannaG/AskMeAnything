import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {ExecutionService} from "./execution.service";
import {ServiceDto} from "./dto/service.dto";

@Controller('execution')
export class ExecutionController {
    constructor(private readonly executionService : ExecutionService) {}
    
    @Post()
    async Execute(@Body() body: ServiceDto) {
        return this.executionService.execute(body);
    }
}
