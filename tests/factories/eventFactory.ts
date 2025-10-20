import prisma from "../../src/database";
import { faker } from "@faker-js/faker";


export async function createEvent() {
  return prisma.event.create({
    data: {
      name: faker.company.name(),
      date: faker.date.future(),
    },
  });
}
