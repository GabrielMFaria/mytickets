import supertest from "supertest";
import app from "../../src/index";
import prisma from "../utils/prisma";

const api = supertest(app);

let testEvent: any;
let testTicket: any;

beforeEach(async () => {
  // Limpa tickets e eventos
  await prisma.ticket.deleteMany({});
  await prisma.event.deleteMany({});

  // Cria evento com data futura
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 1);

  testEvent = await prisma.event.create({
    data: { name: "Evento Teste Tickets", date: futureDate },
  });

  // Cria ticket vinculado ao evento
  testTicket = await prisma.ticket.create({
    data: { code: "TICKET-TEST", owner: "Tester", eventId: testEvent.id },
  });
});

afterAll(async () => {
  await prisma.ticket.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.$disconnect();
});

describe("Tickets Controller", () => {
  it("GET /events/:eventId/tickets → deve retornar todos os tickets de um evento", async () => {
    const response = await api.get(`/events/${testEvent.id}/tickets`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: testTicket.id, owner: testTicket.owner }),
      ])
    );
  });

  it("GET /events/:eventId/tickets → deve retornar 404 se eventId não existir", async () => {
    const response = await api.get("/events/999999/tickets");
    expect(response.status).toBe(404);
  });

  it("POST /tickets → deve criar um ticket", async () => {
    const newTicket = {
      code: "TICKET-NEW",
      owner: "New Owner",
      eventId: testEvent.id,
    };

    const response = await api.post("/tickets").send(newTicket);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.code).toBe(newTicket.code);
  });

  it("POST /tickets → deve retornar 409 se código duplicado no mesmo evento", async () => {
    const response = await api.post("/tickets").send({
      code: "TICKET-TEST",
      owner: "Tester 2",
      eventId: testEvent.id,
    });

    expect(response.status).toBe(409);
  });

  it("PUT /tickets/:id → deve marcar um ticket como usado", async () => {
    const response = await api.put(`/tickets/${testTicket.id}`);

    expect(response.status).toBe(204);

    const updatedTicket = await prisma.ticket.findUnique({ where: { id: testTicket.id } });
    expect(updatedTicket?.used).toBe(true);
  });

  it("PUT /tickets/:id → deve retornar 404 se ticket não existir", async () => {
    const response = await api.put("/tickets/999999");
    expect(response.status).toBe(404);
  });
});
