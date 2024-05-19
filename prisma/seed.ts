import { MessageStatus, MessageType, PrismaClient } from '@prisma/client';
import { fromZonedTime } from 'date-fns-tz';
const prisma = new PrismaClient();
async function main() {
  const john = await prisma.user.upsert({
    where: { email: 'john@prisma.io' },
    update: {},
    create: {
      email: 'john@prisma.io',
      first_name: 'John',
      last_name: 'Lennon',
      birth_date: '2024-05-19',
      timezone: 'Asia/Jakarta',
    },
  });

  const paul = await prisma.user.upsert({
    where: { email: 'paul@prisma.io' },
    update: {},
    create: {
      email: 'paul@prisma.io',
      first_name: 'Paul',
      last_name: 'McCartney',
      birth_date: '2024-05-19',
      timezone: 'Asia/Jakarta',
    },
  });

  const ringo = await prisma.user.upsert({
    where: { email: 'ringo@prisma.io' },
    update: {},
    create: {
      email: 'ringo@prisma.io',
      first_name: 'Ringo',
      last_name: 'Starr',
      birth_date: '2024-05-19',
      timezone: 'Asia/Makassar',
    },
  });

  const george = await prisma.user.upsert({
    where: { email: 'george@prisma.io' },
    update: {},
    create: {
      email: 'george@prisma.io',
      first_name: 'George',
      last_name: 'Harrison',
      birth_date: '2024-05-19',
      timezone: 'Asia/Jakarta',
    },
  });

  await prisma.message.create({
    data: {
      user_id: john.id,
      text: `Hey, ${john.first_name} ${john.last_name} it's your birthday!`,
      type: MessageType.BIRTHDAY,
      status: MessageStatus.SCHEDULED,
      scheduled_at: fromZonedTime(john.birth_date, john.timezone),
    },
  });

  await prisma.message.create({
    data: {
      user_id: paul.id,
      text: `Hey, ${paul.first_name} ${paul.last_name} it's your birthday!`,
      type: MessageType.BIRTHDAY,
      status: MessageStatus.SCHEDULED,
      scheduled_at: fromZonedTime(paul.birth_date, paul.timezone),
    },
  });

  await prisma.message.create({
    data: {
      user_id: ringo.id,
      text: `Hey, ${ringo.first_name} ${ringo.last_name} it's your birthday!`,
      type: MessageType.BIRTHDAY,
      status: MessageStatus.SCHEDULED,
      scheduled_at: fromZonedTime(ringo.birth_date, ringo.timezone),
    },
  });

  await prisma.message.create({
    data: {
      user_id: george.id,
      text: `Hey, ${george.first_name} ${george.last_name} it's your birthday!`,
      type: MessageType.BIRTHDAY,
      status: MessageStatus.SCHEDULED,
      scheduled_at: fromZonedTime(george.birth_date, george.timezone),
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
