import {HttpModule, Module} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import {UserService} from "../user/user.service";
import {UserModule} from "../user/user.module";
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from '@nestjs/jwt';

@Module({
  imports: [UserModule, HttpModule, PassportModule,
    JwtModule.register({
      secret: `${process.env.TOKEN_SECRET}`,
      signOptions: {expiresIn : '1d'}

    })],
  providers: [AuthenticationService, UserService],
  controllers: [AuthenticationController]
})
export class AuthenticationModule {}
