import { Controller, Post, Body } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(private jwtService: JwtService) {}

  @Post('login')
  async login(@Body() body: any) {
    // Simulation simplifiée pour test :
    // On passe simplement id et role dans le body
    const payload = { 
      username: body.username, 
      sub: body.id, 
      role: body.role 
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
