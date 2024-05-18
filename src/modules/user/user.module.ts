import { Module } from '@nestjs/common';
import { UserService } from '@src/modules/user/user.service';
import { UserController } from '@src/modules/user/user.controller';
import { UserRepository } from '@src/modules/user/user.repository';
import { PrismaModule } from '@src/libs/prisma/prisma.module';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository],
  imports: [PrismaModule],
  exports: [UserService],
})
export class UserModule {}
