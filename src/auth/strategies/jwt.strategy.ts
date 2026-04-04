import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secretKey', // À remplacer par une variable d'environnement
    });
  }

  async validate(payload: any) {
    // Le payload doit contenir userId et role pour matcher CvController et RolesGuard
    return { userId: payload.sub, username: payload.username, role: payload.role };
  }
}
