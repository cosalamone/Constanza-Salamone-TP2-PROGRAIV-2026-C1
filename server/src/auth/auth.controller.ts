import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

interface JwtRequest {
  user: {
    sub: string;
    username: string;
    role: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerAuthDto: RegisterAuthDto) {
    return this.authService.register(registerAuthDto);
  }

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    return this.authService.login(body.username, body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Post('authorize')
  async authorize(@Request() req: JwtRequest) {
    const user = req.user;
    const validatedUser = await this.authService.validateToken(user.sub);
    return { user: validatedUser };
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refresh(@Request() req: JwtRequest) {
    const user = req.user;
    return this.authService.refreshToken(user.sub);
  }
}
