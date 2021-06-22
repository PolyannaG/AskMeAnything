import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus, Param,
    Post,
    Req,
    Res,
    UnauthorizedException,
    UseGuards
} from '@nestjs/common';
import {AuthenticationService} from "./authentication.service";
import {UserService} from "../user/user.service";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from "bcrypt"
import {Response, Request} from "express";
import {JwtAuthGuard} from "./jwt-auth.guard";
import {CreateUserDto} from "./dto/create-user.dto";
import {TokenDto} from "./dto/token.dto";


@Controller('authentication')
export class AuthenticationController {
    constructor(
        private readonly authenticationService: AuthenticationService,
        private readonly userService: UserService,
        private readonly jwtService: JwtService

    ) {}

    async onModuleInit() {
        let subscribed = await this.authenticationService.Subscribe();
        if (subscribed)
            return "Subscribed successfully";
        else
            return "Something went wrong, cannot subscribe for now";
    }

    async onApplicationShutdown() {
        let unsubscribed = this.authenticationService.unSubscribe();
        if (unsubscribed)
            return "Unsubscribed successfully";
        else
            return "Something went wrong, cannot unsubscribe for now";
    }

    @Get('authorization')
    async Auth(@Body() token : TokenDto) {
        return this.authenticationService.validateRequest(token)
    }

    @Post('register')
    async register(@Body() registrationData: CreateUserDto) {
        const user=await this.authenticationService.register(registrationData);
        const {password,...result}=user
        return result
    }


    @Post('login')
    async logIn(@Body ('username') username :string, @Body('password') password :string, @Res({passthrough : true}) response : Response) {

        const user=await this.userService.findByUsername(username)
        //console.log(user)
        if (!user){
            response.status(400)
            response.clearCookie('token')
            return new HttpException('invalid username', HttpStatus.BAD_REQUEST)
        }
        // @ts-ignore
        else if (!await bcrypt.compare(password, user.password)){
            response.status(400)
            response.clearCookie('token')
            return new HttpException('invalid password', HttpStatus.BAD_REQUEST)
        }
        else {
            // @ts-ignore
            const token = await this.authenticationService.getCookieWithJwtToken(user.id, user.username);
            response.cookie('token', token, {httpOnly: true})
            return {
                message: 'success'
            }
        }
    }

    //@UseGuards(JwtAuthGuard)
    @Get('user')
    async user(@Req() request: Request){
        try {

            const cookie = request.cookies['token']

            const data = await this.jwtService.verifyAsync(cookie)

            if (!data)
                throw new UnauthorizedException()

            const user=await this.userService.findOne(data._id)
            // @ts-ignore
            const {password, ...result}=user

            return result

        }catch (e){
            throw new UnauthorizedException()
        }
    }

    //@UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@Res({passthrough : true}) response: Response){
        response.clearCookie('token')
        return{
            message : "successful logout"
        }
    }

}
