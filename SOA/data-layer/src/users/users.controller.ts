import {Body, Controller, Get, Param, Post, Res} from '@nestjs/common';
import {UsersService} from "./users.service";
import {CreateUserDto} from "./dto/create-user.dto";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService : UsersService) {}
    //authentication service
    @Post('register')
    register(@Body() registrationData: CreateUserDto) {
        return this.usersService.insertUser(registrationData)
    }

    @Get('findOneUser')
    findUser(@Param('id') id:number){
        return this.usersService.findOneUserQuery(id)
    }

    @Get('findByUsername')
    findByUsername(@Param ('username') username :string) {
        return this.usersService.findByUsernameQuery(username)
    }

}
