import prisma from "../../src/database";
import { faker } from "@faker-js/faker";
import { createEvent } from "./eventFactory";

/**
 @param eventId 
 @returns
 */
export async function createTicket(eventId?: number) {
  const event = eventId ? { id: eventId } : await createEvent();

  return prisma.ticket.create({
    data: {
      code: faker.datatype.uuid(),
      owner: faker.name.firstName(),
      eventId: event.id,
    },
  });
}
