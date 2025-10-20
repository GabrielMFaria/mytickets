import supertest from "supertest";
import app from "../../src/index";
import prisma from "../../src/database";
import { cleanDatabase } from "../utils/cleanDatabase";
import { createEvent } from "../factories/eventFactory";

const api = supertest(app);

beforeEach(async () => {
  await cleanDatabase();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Tickets integration tests", () => {
  it("should create a new ticket", async () => {
    const event = await createEvent();

    const ticketData = {
      code: crypto.randomUUID(), 
      owner: "Gabriel",
      eventId: event.id,
    };

    const response = await api.post("/tickets").send(ticketData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.owner).toBe(ticketData.owner);
  });

  it("should not allow duplicate ticket codes for same event", async () => {
    const event = await createEvent();

    const uniqueCode = crypto.randomUUID();

    await api.post("/tickets").send({
      code: uniqueCode,
      owner: "Gabriel",
      eventId: event.id,
    });

    const response = await api.post("/tickets").send({
      code: uniqueCode,
      owner: "Lucas",
      eventId: event.id,
    });

    expect(response.status).toBe(409);
  });
});
