import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpException, HttpStatus,
  Post,
  Req,
  Res,
  UseGuards
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import {CreateUserDto} from "../user/dto/create-user.dto";
import * as bcrypt from "bcrypt"
import {UserService} from "../user/user.service";
import {Response} from "express";
import {constants} from "http2";
import any = jasmine.any;


@Controller('auth')
export class AuthenticationController {
  constructor(
      private readonly authenticationService: AuthenticationService,
    private readonly userService: UserService
  ) {}

  @Post('register')
  async register(@Body() registrationData: CreateUserDto) {
    return this.authenticationService.register(registrationData);
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
}
