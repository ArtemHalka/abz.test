import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

type JwtPayload = { exp: number };

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const session: Record<string, any> = request.session;
    const tokenHeader = request.header('Token');
    const sessionToken = session.token;

    if (!tokenHeader) {
      return false;
    }
    const decodedJwtAccessToken: JwtPayload = this.jwtService.decode(
      tokenHeader,
    ) as JwtPayload;

    const expires = decodedJwtAccessToken.exp;

    return expires >= Math.floor(Date.now() / 1000);
  }
}
