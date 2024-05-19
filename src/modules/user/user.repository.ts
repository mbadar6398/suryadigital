import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '@src/libs/prisma/prisma.service';

export type CreateUserRequestDto = Omit<
  User,
  'id' | 'created_at' | 'updated_at' | 'deleted_at'
> & { id?: string };

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(user: CreateUserRequestDto): Promise<User> {
    return await this.prisma.user.create({ data: user });
  }

  async softDelete(id: string, data: User): Promise<void> {
    await this.prisma.user.update({
      where: { id: id },
      data: { ...data, deleted_at: new Date() },
    });
  }

  async findById(id: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { email } });
  }
}
