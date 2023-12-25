import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
@Injectable()
export class UserService {
  async createUser(data: any) {
    data.password = await bcrypt.hash(data.password, 10);
    return prisma.user.create({
      data,
      select: {
        id: true,
        name: true,
        lastname: true,
        gender: true,
      },
    });
  }
}
