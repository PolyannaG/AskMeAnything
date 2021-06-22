import {HttpService, Injectable, NotFoundException} from '@nestjs/common';
import {map} from "rxjs/operators";

@Injectable()
export class UserService {
    constructor(private readonly httpService : HttpService) {}

    async create(createUserDto: object) : Promise<Object>{
        let signed_up_user = await this.httpService.post("http://localhost:8006/users/register", createUserDto )
            .pipe(map(response => response.data))
            .toPromise();
        return signed_up_user;
    }

    async findOne(id: number) : Promise<Object>{
        const user = await this.httpService.get("http://localhost:8006/users/findOneUser/"+id)
            .pipe(map(response => response.data))
            .toPromise();

        if (!user)
            throw new NotFoundException(`User with id ${id} not found.`)
        return user;
    }

    async findByUsername(username: string) : Promise<Object>{
        return await this.httpService.get("http://localhost:8006/users/findByUsername/"+username)
            .pipe(map(response => response.data))
            .toPromise();
    }

}
