import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const teacherRole = await prisma.role.upsert({
    where: { title: 'Teacher' },
    update: {},
    create: { title: 'Teacher' },
  });

  const studentRole = await prisma.role.upsert({
    where: { title: 'Student' },
    update: {},
    create: { title: 'Student' },
  });

  const saltRounds = 10;
  const password = await bcrypt.hash('supersecret', saltRounds);

  const teacher1 = await prisma.teacher.upsert({
    where: { email: 'john.doe@elm.ai' },
    update: {},
    create: {
      email: 'john.doe@elm.ai',
      firstName: 'John',
      lastName: 'Doe',
      user: {
        create: {
          username: 'john.doe@elm.ai',
          password: password,
          roleId: teacherRole.id,
        },
      },
    },
  });

  const teacher2 = await prisma.teacher.upsert({
    where: { email: 'jane.doe@elm.ai' },
    update: {},
    create: {
      email: 'jane.doe@elm.ai',
      firstName: 'Jane',
      lastName: 'Doe',
      user: {
        create: {
          username: 'jane.doe@elm.ai',
          password: password,
          roleId: teacherRole.id,
        },
      },
    },
  });

  const student1 = await prisma.student.upsert({
    where: { email: 'mark@elm.ai' },
    update: {},
    create: {
      email: 'mark@elm.ai',
      firstName: 'Mark',
      lastName: 'Ruffalo',
      user: {
        create: {
          username: 'mark@elm.ai',
          password: password,
          roleId: studentRole.id,
        },
      },
    },
  });

  const student2 = await prisma.student.upsert({
    where: { email: 'nona@elm.ai' },
    update: {},
    create: {
      email: 'nona@elm.ai',
      firstName: 'Nona',
      lastName: 'Manis',
      user: {
        create: {
          username: 'nona@elm.ai',
          password: password,
          roleId: studentRole.id,
        },
      },
    },
  });

  const student3 = await prisma.student.upsert({
    where: { email: 'harris@elm.ai' },
    update: {},
    create: {
      email: 'harris@elm.ai',
      firstName: 'Harris',
      lastName: 'J',
      user: {
        create: {
          username: 'harris@elm.ai',
          password: password,
          roleId: studentRole.id,
        },
      },
    },
  });

  console.log({ teacher1, teacher2, student1, student2, student3 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
