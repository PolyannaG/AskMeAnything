import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus, Param,
    Post,
    Req,
    Res,
    UnauthorizedException
} from '@nestjs/common';
import {AuthenticationService} from "./authentication.service";
import {UserService} from "../user/user.service";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from "bcrypt"
import {Response, Request} from "express";
import {CreateUserDto} from "./dto/create-user.dto";


@Controller('authentication')
export class AuthenticationController {
    constructor(
        private readonly authenticationService: AuthenticationService,
        private readonly userService: UserService,
        private readonly jwtService: JwtService

    ) {}

    async onModuleInit(): Promise<string> {
        let subscribed = await this.authenticationService.Subscribe();
        if (subscribed)
            return "Subscribed successfully";
        else
            return "Something went wrong, cannot subscribe for now";
    }

    async onModuleDestroy(): Promise<string> {
        let unsubscribed = await this.authenticationService.unSubscribe();
        if (unsubscribed)
            return "Unsubscribed successfully";
        else
            return "Something went wrong, cannot unsubscribe for now";
    }

    @Post('authorization')
    async Auth(@Body() params : object) {
        try {
            if (params == {})
                return false
            else {
                const cookie = params["token"];
                const data = await this.jwtService.verifyAsync(cookie);
                if (data)
                    return true
                else
                    return false
            }
        }
        catch (e){
            return false
        }
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
           // response.clearCookie('token')
            return new HttpException('invalid username', HttpStatus.BAD_REQUEST)
        }
        // @ts-ignore
        else if (!await bcrypt.compare(password, user.password)){
            response.status(400)
           // response.clearCookie('token')
            return new HttpException('invalid password', HttpStatus.BAD_REQUEST)
        }
        else {
            // @ts-ignore
            const token = await this.authenticationService.getCookieWithJwtToken(user.id, user.username);
            response.set({ 'x-access-token': token });
            return {
                message: token
            }
        }
    }

    //@UseGuards(JwtAuthGuard)
    @Get('user')
    async user(@Req() request: Request){
        try {

           // const cookie = request.cookies['token']
            const cookie = request.headers['x-access-token']

            if (typeof cookie === "string") {
                const data = await this.jwtService.verifyAsync(cookie)


                if (!data)
                    throw new UnauthorizedException()

                const user = await this.userService.findOne(data._id)
                // @ts-ignore
                const {password, ...result} = user

                return result
            }

        }catch (e){
            throw new UnauthorizedException()
        }
    }

    //@UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@Req() request: Request ,@Res({passthrough : true}) response: Response){
        try {

           // const cookie = request.cookies['token']
            const cookie = request.headers['x-access-token']

            if (typeof cookie === "string") {
                const data = await this.jwtService.verifyAsync(cookie)


                if (!data)
                    throw new UnauthorizedException()

                // response.clearCookie('token')
                return {
                    message: "successful logout"
                }
            }

        }catch (e){
            throw new UnauthorizedException()
        }

    }

    @Post('userId')
    async userId(@Body() params : object): Promise<number> {
        try {
            const cookie = params["token"];
            const data = await this.jwtService.verifyAsync(cookie);

            if (!data)
                throw new UnauthorizedException()

            return data._id

        } catch (e){
            throw new UnauthorizedException()
        }
    }

}
