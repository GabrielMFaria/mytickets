import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createUser() {
  return prisma.user.create({
    data: {
      email: faker.internet.email(),
      password: faker.internet.password(),
    },
  });
}
