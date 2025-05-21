import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/create-auth.dto';
import { Response } from 'express';
import { LoginDto } from './dto/login-auth.dto';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.register(registerDto, res);
  }
  @Post('/login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true })
    res: Response,
  ) {
    return await this.authService.login(loginDto, res);
  }
  @Post('/logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    return await this.authService.logout(res);
  }
}
