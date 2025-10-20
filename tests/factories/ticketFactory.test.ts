import prisma from "../../src/database";
import { createTicket } from "./ticketFactory";
import { createEvent } from "./eventFactory";
import { cleanDatabase } from "../utils/cleanDatabase";

beforeEach(async () => {
  await cleanDatabase();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("ticketFactory", () => {
  it("deve criar um ticket válido com evento passado", async () => {
    const event = await createEvent();
    const ticket = await createTicket(event.id);

    expect(ticket).toHaveProperty("id");
    expect(ticket.eventId).toBe(event.id);
    expect(ticket.code).toBeDefined();
    expect(ticket.owner).toBeDefined();
  });

  it("deve criar um ticket válido sem evento passado", async () => {
    const ticket = await createTicket();

    expect(ticket).toHaveProperty("id");
    expect(ticket.eventId).toBeDefined();
    expect(ticket.code).toBeDefined();
    expect(ticket.owner).toBeDefined();
  });
});
