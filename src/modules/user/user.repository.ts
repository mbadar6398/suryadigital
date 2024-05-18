import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '@src/libs/prisma/prisma.service';

export type CreateUserRequestDto = Omit<
  User,
  'id' | 'created_at' | 'updated_at'
> & { id?: string };

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(user: CreateUserRequestDto): Promise<User> {
    return await this.prisma.user.create({ data: user });
  }
}
