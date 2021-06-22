import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {UserService} from "../user/user.service";
import * as bcrypt from "bcrypt";
import {CreateUserDto} from "./dto/create-user.dto";

@Injectable()
export class AuthenticationService {
    constructor(
        private readonly userService : UserService,
        private readonly jwtService: JwtService) {
    }

    public async register(registrationData: CreateUserDto) : Promise<any>{
        // const hashedPassword = await bcrypt.hash(registrationData.password, 10);
        const hashedPassword = await bcrypt.hash(registrationData.password, '$2b$12$mzZXxm.lIzmqEMht8NVw1O');

        const user=await this.userService.findByUsername(registrationData.username)
        //console.log(user)
        if (user)
            throw new HttpException(`User with username ${registrationData.username} already exists.`, HttpStatus.BAD_REQUEST)
        else
            try {
                const createdUser = await this.userService.create({
                    ...registrationData,
                    password: hashedPassword
                });
                createdUser.password = undefined;
                return createdUser;
            } catch (error) {
                throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
            }
    }

    public async getCookieWithJwtToken(userId: number , username : string) {
        return await this.jwtService.signAsync({_id: userId, _username: username});
    }
}
