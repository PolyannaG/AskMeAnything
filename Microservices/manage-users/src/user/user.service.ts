import {Injectable, NotFoundException} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {InjectEntityManager} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {EntityManager} from "typeorm";


@Injectable()
export class UserService {

  constructor(@InjectEntityManager() private manager: EntityManager) {}


    async create(createUserDto: CreateUserDto) : Promise<User>{
      const user=this.manager.create(User, createUserDto)
      return this.manager.save(user)
    }


    async findOne(id: number) : Promise<User>{
      const user=this.manager.findOne(User, {where : {id : id}})
      if (!user)
        throw new NotFoundException(`User with id ${id} not found.`)
      return user;
    }

    async findByUsername(username: string) : Promise<User>{
      return this.manager.findOne(User, {where: {username: username}})
    }

}




