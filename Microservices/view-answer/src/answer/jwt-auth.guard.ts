import {Injectable, CanActivate, ExecutionContext} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request} from "express";
import {JwtService} from "@nestjs/jwt";


@Injectable()
export class JwtAuthGuard implements CanActivate {

    constructor(
        private readonly jwtService : JwtService

    ) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    async validateRequest(request: Request) {
        try {
            const cookie = request.cookies['token']
            console.log(cookie)
            const data = this.jwtService.verify(cookie)
            console.log(data)
            if (data)
                return true
            else
                return false
        }
        catch (e){
            return false
        }

    }

}