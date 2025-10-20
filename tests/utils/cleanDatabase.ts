import prisma from "./prisma";

export async function cleanDatabase() {
  await prisma.ticket.deleteMany({});
  await prisma.event.deleteMany({});
}
