import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/create-auth.dto';
import { Response } from 'express';
import { LoginDto } from './dto/login-auth.dto';
@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  private async generateTokens(userId: string, role: string) {
    const payload = { sub: userId, role };
    const access_token = this.jwtService.sign(payload, {
      expiresIn: '4h',
      secret: this.configService.get('JWT_KEY'),
    });

    return access_token;
  }

  async register(registerdto: RegisterDto, res: Response) {
    const user = await this.prismaService.user.findUnique({
      where: { email: registerdto.email },
    });
    if (user) {
      throw new ConflictException("Siz avval ro'yxatdan o'tgansiz!!!");
    }
    const hashPassword = await bcrypt.hash(registerdto.password, 12);
    const userData = await this.prismaService.user.create({
      data: {
        username: registerdto.username,
        email: registerdto.email,
        password: hashPassword,
      },
    });
    const token = await this.generateTokens(userData.id, userData.role);
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 12 * 60 * 60 * 1000,
    });
    return {
      success: true,
      message: "Ro'yhatdan muvaffaqiyatli o'tdingiz",
      data: {
        username: registerdto.username,
        email: registerdto.email,
        password: hashPassword,
      },
    };
  }
  async login(loginDto: LoginDto, res: Response) {
    const user = await this.prismaService.user.findUnique({
      where: { email: loginDto.email },
    });
    if (!user) {
      throw new BadRequestException('Email yoki parol xato!!!');
    }
    const comparePassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!comparePassword)
      throw new BadRequestException('Email yoki parol xato!!!');
    const token = await this.generateTokens(user.id, user.role);
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });
    return {
      success: true,
      message: 'Tizimga muvaffaqiyatli kirdingiz!!!',
      data: {
        user_id: user.id,
        username: user.username,
      },
    };
  }
  async logout(res: Response) {
    res.clearCookie('access_token');
    return {
      success: true,
      message: 'Tizimdan muvaffaqiyatli chiqdingiz',
    };
  }
}
