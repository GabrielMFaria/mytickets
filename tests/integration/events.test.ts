import supertest from "supertest";
import app from "../../src/index";
import prisma from "../../src/database";
import { cleanDatabase } from "../utils/cleanDatabase";
import { faker } from "@faker-js/faker";


const api = supertest(app);

beforeEach(async () => {
  await cleanDatabase();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Events integration tests", () => {
  it("should create a new event", async () => {
    const body = {
      name: faker.company.name(),
      date: faker.date.future(),
    };

    const response = await api.post("/events").send(body);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe(body.name);
  });

  it("should return all events", async () => {
    await api.post("/events").send({ name: "Festival", date: faker.date.future() });
    const response = await api.get("/events");

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });
});
