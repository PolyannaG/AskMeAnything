import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  async validateRequest(req: Request) {
    try {
      //const cookie = req.cookies['token']
      const cookie = req.headers['x-access-token'];
      if (typeof cookie === 'string') {
        const data = await this.jwtService.verifyAsync(cookie);

        if (data) return true;
        else return false;
      } else return false;
    } catch (e) {
      return false;
    }
  }
}
