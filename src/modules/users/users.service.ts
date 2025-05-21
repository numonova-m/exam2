import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AdminDto } from './dto/create-admin';
import * as bcrypt from 'bcrypt';
import { SuperAdmindTO } from './dto/create-superadmin';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async createAdmin(createAdminDto: AdminDto) {
    const { username, email, password, role } = createAdminDto;
    const findUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (findUser) {
      return {
        success: false,
        message: 'bu emaildan avval foydalanilgan',
      };
    }
    const hashpassword = await bcrypt.hash(password, 12);
    const newAdmin = await this.prisma.user.create({
      data: {
        username,
        email,
        password: hashpassword,
        role,
      },
    });
    return {
      success: true,
      message: 'Admin yaratildi',
      data: {
        id: newAdmin.id,
        username: newAdmin.username,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    };
  }
  async deleteAdmin(id: string) {
    await this.prisma.user.delete({
      where: { id },
    });
    return {
      success: true,
      message: 'Admin faoliyati yakunlandi',
    };
  }
  async createSuperAdmin() {
    const email = process.env.SUPERADMIN_EMAIL;
    const username = process.env.SUPERADMIN_USERNAME;
    const password = process.env.SUPERADMIN_PASSWORD;

    if (!email || !username || !password) {
      console.warn('SUPERADMIN_* env sozlamalari topilmadi');
      return;
    }

    const existing = await this.prisma.user.findUnique({ where: { email } });

    if (!existing) {
      const passwordHash = await bcrypt.hash(password, 10);
      await this.prisma.user.create({
        data: {
          email,
          username,
          password: passwordHash,
          role: 'SUPERADMIN',
        },
      });
      console.log('SuperAdmin yaratildi');
    } else {
      console.log('SuperAdmin allaqachon mavjud');
    }
  }
}
