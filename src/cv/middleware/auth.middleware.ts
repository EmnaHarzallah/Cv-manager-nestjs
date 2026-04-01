import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['auth-user'] as string;

    if (!token) {
      throw new UnauthorizedException('Token manquant');
    }

    try {
      const secret = process.env.JWT_SECRET || 'SECRET_KEY';
      const decoded = verify(token, secret) as { userId: number };

      if (!decoded.userId) {
        throw new UnauthorizedException('userId manquant');
      }

      req['userId'] = decoded.userId;
      next();

    } catch (error) {
      throw new UnauthorizedException('Token invalide');
    }
  }
}
