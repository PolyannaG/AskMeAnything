import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import {UserModule} from "../user/user.module";
import {PassportModule} from "@nestjs/passport";
import {JwtModule, JwtService} from '@nestjs/jwt';
import {UserService} from "../user/user.service";


@Module({
  imports : [UserModule, PassportModule,
    JwtModule.register({
      secret: `${process.env.TOKEN_SECRET}`,
      signOptions: {expiresIn : '1d'}

    })],
  controllers: [AuthenticationController],
  providers: [AuthenticationService,UserService]
})
export class AuthenticationModule {}
