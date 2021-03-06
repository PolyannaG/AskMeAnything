import {
  BadRequestException,
  Body,
  Controller, Get,
  HttpCode,
  HttpException, HttpStatus,
  Post,
  Req,
  Res, UnauthorizedException,
  UseGuards
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import {CreateUserDto} from "../user/dto/create-user.dto";
import * as bcrypt from "bcrypt"
import {UserService} from "../user/user.service";
import {Response, Request} from "express";
import {JwtService} from "@nestjs/jwt";
import {JwtAuthGuard} from "./jwt-auth.guard";



@Controller('auth')
export class AuthenticationController {
  constructor(
      private readonly authenticationService: AuthenticationService,
     private readonly userService: UserService,
      private readonly jwtService: JwtService

  ) {}

  async onModuleInit() {
    await this.authenticationService.subscribe();
    return "Subscribed successfully";
  }

  @Post('authorization')
  async Auth(@Body() body : object): Promise<boolean> {
    try {
      if (body == {})
        return false
      else {
        const cookie = body["token"];
        const data = await this.jwtService.verifyAsync(cookie);
        if (data)
          return true
        else
          return false
      }
    } catch (e){
      return false
    }
  }

  @Post('userId')
  async getUserId(@Body() body : object): Promise<number> {
    try {
      const cookie = body["token"];
      const data = await this.jwtService.verifyAsync(cookie);

      if (!data)
        throw new UnauthorizedException()

      return data._id

    } catch (e){
      throw new UnauthorizedException()
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
    console.log(user)
    if (!user){
      response.status(400)
      //response.clearCookie('token')
      return new HttpException('invalid username', HttpStatus.BAD_REQUEST)
    }
    else if (!await bcrypt.compare(password, user.password)){
      response.status(400)
     // response.clearCookie('token')
      return new HttpException('invalid password', HttpStatus.BAD_REQUEST)
    }
    else {
      const token = await this.authenticationService.getCookieWithJwtToken(user.id, user.username);
      //response.cookie('token', token, { httpOnly: true, secure: true });
      response.set({ 'x-access-token': token });
      return {
        message: token
      }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
   async user(@Req() request: Request){
    try {

     // const cookie = request.cookies['token']
      const cookie = request.headers['x-access-token']
      console.log('cookie is:');
      console.log(request.headers['x-access-token'])

      if (typeof cookie === 'string') {
        const data = await this.jwtService.verifyAsync(cookie)

        //console.log(data)
        if (!data)
          throw new UnauthorizedException()

        const user = await this.userService.findOne(data._id)
        const { password, ...result } = user;

        return result
      }
    } catch (e) {
      throw new UnauthorizedException()
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Res({passthrough : true}) response: Response){
    //response.clearCookie('token')
    return{
      message : "procceed to logout"
    }
  }


}
