import { Injectable } from '@nestjs/common';
import {InjectEntityManager} from "@nestjs/typeorm";
import {EntityManager} from "typeorm";
import {User} from "../entities/user.entity";
import {CreateUserDto} from "./dto/create-user.dto";

@Injectable()
export class UsersService {

    constructor(@InjectEntityManager() private manager: EntityManager) {}

    async insertUser(createUserDto: CreateUserDto): Promise<User> {
        const user=this.manager.create(User, createUserDto)
        return this.manager.save(user)
    }

    async findOneUserQuery(id : number): Promise<User> {
        return this.manager.findOne(User, {where : {id : id}})
    }

    async findByUsernameQuery(username : string): Promise<User> {
        return this.manager.findOne(User, {where: {username: username}})
    }

}
