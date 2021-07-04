import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {UserService} from "../user/user.service";
import * as bcrypt from "bcrypt"
import {CreateUserDto} from "../user/dto/create-user.dto";
import {User} from "../user/entities/user.entity";
import {JwtService} from "@nestjs/jwt";
import {RedisService} from "nestjs-redis";
import {Request} from "express";

@Injectable()
export class AuthenticationService {
    private client: any;
    constructor(private readonly userService : UserService,
                private readonly jwtService: JwtService,
                private redisService: RedisService) {
        this.getClient();
    }
    private async getClient() {
        this.client = await this.redisService.getClient();
    }

    async subscribe (): Promise<string> {
        let sub = await this.client.hget('subscribers', 'auth');
        let subscribers = JSON.parse(sub);
        let myAddress = "http://localhost:8002/auth";
        let alreadySubscribed = false;

        if (subscribers == null){
            subscribers = []
            subscribers[0] = myAddress
            await this.client.hset('subscribers', 'auth', JSON.stringify(subscribers));
            return "Subscribed";
        }
        else {
            for (let i = 0; i < subscribers.length; i++) {
                if (subscribers[i] == myAddress)
                    alreadySubscribed = true;
            }
            if (alreadySubscribed == false) {
                subscribers.push(myAddress);
                await this.client.hset('subscribers', 'auth', JSON.stringify(subscribers));
                return "Subscribed";
            }
            else
                return "Already subscribed";
        }
    }

    public async register(registrationData: CreateUserDto) : Promise<User>{
       // const hashedPassword = await bcrypt.hash(registrationData.password, 10);
        const hashedPassword = await bcrypt.hash(registrationData.password, '$2b$12$mzZXxm.lIzmqEMht8NVw1O');

            const user=await this.userService.findByUsername(registrationData.username)
            console.log(user)
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
