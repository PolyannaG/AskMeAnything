import {HttpException, HttpService, HttpStatus, Injectable} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {UserService} from "../user/user.service";
import * as bcrypt from "bcrypt";
import {CreateUserDto} from "./dto/create-user.dto";
import {RedisService} from "nestjs-redis";
import {catchError, map} from "rxjs/operators";

@Injectable()
export class AuthenticationService {
    private client: any;
    constructor( private readonly userService : UserService,
                 private readonly jwtService: JwtService,
                 private httpService: HttpService,
                private redisService: RedisService) {
        this.getClient();
    }
    private async getClient() {
        this.client = await this.redisService.getClient();
    }

    async Subscribe(): Promise<any> {
        let body = {
            name : "Manage-Users",
            address : "http://localhost:8007/authentication",
            description : "User sign in/out or sign up and authorization provider",
            services : [{name:"Authorization", url: "https://manageuserssoa.herokuapp.com/authentication/authorization", requestMethod: "post", params: {token: "User token (string)"}},
                        {name:"cookieUserId", url: "https://manageuserssoa.herokuapp.com/authentication/userId", requestMethod: "post", params: {token: "User token (string)"}}]
        };

        return await this.httpService.post("https://esbsoa.herokuapp.com/management/subscribe", body)
            .pipe(catchError(async e => {
            let unsub = await this.client.hget('lost', 'unregisters');
            let sub = await this.client.hget('lost', 'registers');
            let lost_registrations = JSON.parse(sub);
            let lost_unregistrations = JSON.parse(unsub);
            let newUnsub = [];

            if (lost_unregistrations != null) {
                for (let j = 0; j < lost_unregistrations.length; j++) {
                    if (lost_unregistrations[j]["address"] != body["address"])
                        newUnsub.push(lost_unregistrations[j]);
                }

                await this.client.hset('lost', 'unregisters', JSON.stringify(newUnsub));
            }

            if (lost_registrations == null) {
                lost_registrations = [];
                lost_registrations[0] = body;
            }
            else {
                lost_registrations.push(body);
            }

            await this.client.hset('lost', 'registers', JSON.stringify(lost_registrations));
            return false;
        })).toPromise();

    }

    async unSubscribe(): Promise<any> {
        let body = {
            name : "Manage-Users",
            address : "https://manageuserssoa.herokuapp.com/authentication",
            description : "User sign in/out or sign up and authorization provider",
            services : [{name:"Authorization", url: "https://manageuserssoa.herokuapp.com/authentication/authorization", requestMethod: "post", params: {token: "User token (string)"}}]
        };

        return await this.httpService.post("https://esbsoa.herokuapp.com/management/unsubscribe", body)
            .pipe(catchError(async e => {
            let unsub = await this.client.hget('lost', 'unregisters');
            let sub = await this.client.hget('lost', 'registers');
            let lost_registrations = JSON.parse(sub);
            let lost_unregistrations = JSON.parse(unsub);
            let newSub = [];

            if (lost_registrations != null) {
                for (let j = 0; j < lost_registrations.length; j++) {
                    if (lost_registrations[j]["address"] != body["address"])
                        newSub.push(lost_registrations[j]);
                }

                await this.client.hset('lost', 'registers', JSON.stringify(newSub));
            }

            if (lost_unregistrations == null) {
                lost_unregistrations = [];
                lost_unregistrations[0] = body;
            }
            else {
                lost_unregistrations.push(body);
            }

            await this.client.hset('lost', 'unregisters', JSON.stringify(lost_unregistrations));
            return false;
        })).toPromise();

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
                // @ts-ignore
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
