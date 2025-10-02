import prisma from "../../src/database";
  export async function cleanDatabase() {
  await prisma.ticket.deleteMany({});
  await prisma.event.deleteMany({});
  }
