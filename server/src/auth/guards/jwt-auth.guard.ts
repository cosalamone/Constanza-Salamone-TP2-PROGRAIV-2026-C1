import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verify } from 'jsonwebtoken';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly _secret: string;

  constructor(private readonly _configService: ConfigService) {
    const secret = this._configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('Falta JWT_SECRET en .env');
    }
    this._secret = secret;
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Formato de token inválido');
    }

    try {
      const payload = verify(token, this._secret, { algorithms: ['HS256'] });
      (request as any).user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Token inválido');
    }
  }
}
