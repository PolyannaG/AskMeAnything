import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {UserService} from "../user/user.service";
import * as bcrypt from "bcrypt"
import {CreateUserDto} from "../user/dto/create-user.dto";
import {User} from "../user/entities/user.entity";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthenticationService {
    constructor(
        private readonly userService : UserService,
        private readonly jwtService: JwtService) {
    }

    public async register(registrationData: CreateUserDto) : Promise<User>{
        const hashedPassword = await bcrypt.hash(registrationData.password, 10);

            const user=this.userService.findByUsername(registrationData.username)
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

    public async getAuthenticatedUser(username: string, hashedPassword: string) {
        try {
            const user = await this.userService.findByUsername(username);
            const isPasswordMatching = await bcrypt.compare(
                hashedPassword,
                user.password
            );

            if (!isPasswordMatching) {
                throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
            }
            user.password = undefined;
            return user;
        } catch (error) {
            throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
        }
    }

    public async getCookieWithJwtToken(userId: number , username : string) {
        return await this.jwtService.signAsync({_id: userId, _username: username});
    }
}
