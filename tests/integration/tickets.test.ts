import supertest from "supertest";
import app from "../../src/index";
import { createEvent, createTicket } from "../factories/ticketFactory";

const server = supertest(app);

describe("Tickets API", () => {
  it("GET /tickets/:eventId → deve retornar tickets de um evento", async () => {
    const event = await createEvent();
    await createTicket(event.id);

    const res = await server.get(`/tickets/${event.id}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /tickets → deve criar ticket", async () => {
    const event = await createEvent();
    const body = { code: "ABC123", owner: "Gabriel", eventId: event.id };

    const res = await server.post("/tickets").send(body);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(body);
  });
});
