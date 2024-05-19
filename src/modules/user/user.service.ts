import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { AppException } from '@src/common/exceptions/app-exception';
import { ResourceNotFound } from '@src/common/exceptions/common.exception';
import { UserRepository } from '@src/modules/user/user.repository';
import { EmailAlreadyExist } from './user.exceptions';

export type CreateUserRequestDto = Omit<
  User,
  'id' | 'created_at' | 'updated_at' | 'deleted_at'
> & { id?: string };

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async create(dto: CreateUserRequestDto): Promise<User> {
    const user = await this.userRepository.findByEmail(dto.email);

    if (user) {
      throw AppException.fromCode(EmailAlreadyExist);
    }

    return await this.userRepository.create(dto);
  }

  async delete(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw AppException.fromCode(ResourceNotFound);
    }
    await this.userRepository.softDelete(id, user);
  }
}
