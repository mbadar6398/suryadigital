import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserRepository } from '@src/modules/user/user.repository';

export type CreateUserRequestDto = Omit<
  User,
  'id' | 'created_at' | 'updated_at'
> & { id?: string };

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async create(user: CreateUserRequestDto): Promise<User> {
    return await this.userRepository.create(user);
  }
}
