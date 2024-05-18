import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async () => {
  await prisma.$transaction(async (tx) => {
    await tx.user.deleteMany();
  });
};
