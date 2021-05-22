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
      response.clearCookie('token')
      return new HttpException('invalid username', HttpStatus.BAD_REQUEST)
    }
    else if (!await bcrypt.compare(password, user.password)){
      response.status(400)
      response.clearCookie('token')
      return new HttpException('invalid password', HttpStatus.BAD_REQUEST)
    }
    else {
      const token = await this.authenticationService.getCookieWithJwtToken(user.id, user.username);
      response.cookie('token', token, {httpOnly: true})
      return {
        message: 'success'
      }
    }
  }
  @UseGuards(JwtAuthGuard)
  @Get('user')
   async user(@Req() request: Request){
    try {

      const cookie = request.cookies['token']

      const data = await this.jwtService.verifyAsync(cookie)
      //console.log(data)
      if (!data)
        throw new UnauthorizedException()

      const user=await this.userService.findOne(data._id)
      const {password, ...result}=user

      return result

    }catch (e){
      throw new UnauthorizedException()
    }
  }

  @Post('logout')
  async logout(@Res({passthrough : true}) response: Response){
    response.clearCookie('token')
    return{
      message : "successful logout"
    }
  }


}
