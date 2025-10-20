// tests/controllers/eventsController.test.ts
import supertest from "supertest";
import app from "../../src/index";
import prisma from "../utils/prisma";

const api = supertest(app);

beforeEach(async () => {
  // Limpa tickets e eventos antes de cada teste
  await prisma.ticket.deleteMany({});
  await prisma.event.deleteMany({});
});

describe("Events Controller", () => {
  it("GET /events → deve retornar todos os eventos", async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);

    const event = await prisma.event.create({
      data: { name: "Evento GET ALL", date: futureDate },
    });

    const response = await api.get("/events");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: event.id, name: event.name }),
      ])
    );
  });

  it("GET /events/:id → deve retornar um evento específico", async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);

    const event = await prisma.event.create({
      data: { name: "Evento GET", date: futureDate },
    });

    const response = await api.get(`/events/${event.id}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", event.id);
    expect(response.body).toHaveProperty("name", event.name);
  });

  it("GET /events/:id → deve retornar 404 se id não existir", async () => {
    const response = await api.get("/events/999999");
    expect(response.status).toBe(404);
  });

  it("POST /events → deve criar um novo evento", async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);

    const eventData = { name: "Evento POST", date: futureDate };
    const response = await api.post("/events").send(eventData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe(eventData.name);
  });

  it("POST /events → deve retornar 409 se nome duplicado", async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);

    const name = "Evento DUP";
    await prisma.event.create({ data: { name, date: futureDate } });

    const response = await api.post("/events").send({ name, date: futureDate });
    expect(response.status).toBe(409);
  });

  it("PUT /events/:id → deve atualizar um evento existente", async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);

    const event = await prisma.event.create({
      data: { name: "Evento PUT", date: futureDate },
    });

    const updatedData = { name: "Evento PUT Atualizado", date: futureDate };
    const response = await api.put(`/events/${event.id}`).send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(updatedData.name);
  });

  it("PUT /events/:id → deve retornar 404 se id não existir", async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);

    const response = await api.put("/events/999999").send({ name: "Teste", date: futureDate });
    expect(response.status).toBe(404);
  });

  it("DELETE /events/:id → deve deletar um evento existente", async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);

    const event = await prisma.event.create({
      data: { name: "Evento DELETE", date: futureDate },
    });

    const response = await api.delete(`/events/${event.id}`);
    expect(response.status).toBe(204);

    const deletedEvent = await prisma.event.findUnique({ where: { id: event.id } });
    expect(deletedEvent).toBeNull();
  });

  it("DELETE /events/:id → deve retornar 404 se id não existir", async () => {
    const response = await api.delete("/events/999999");
    expect(response.status).toBe(404);
  });
});
