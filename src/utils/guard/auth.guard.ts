import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userAuth = this.extractUserAuthFromHeader(request);

    if (!userAuth) throw new UnauthorizedException();

    if (userAuth) {
      request['user'] = JSON.parse(userAuth);
    }

    return true;
  }

  private extractUserAuthFromHeader(request: Request): any {
    return request.headers.userauth;
  }
}
