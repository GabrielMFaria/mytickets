import supertest from "supertest";
import app from "../../src/index";
import { cleanDatabase } from "../utils/cleanDatabase";

const api = supertest(app);

beforeEach(async () => {
  await cleanDatabase();
});

describe("Events API", () => {
  it("should create an event", async () => {
    const body = { name: "Rock in Rio", date: "2099-01-01" };

    const response = await api.post("/events").send(body);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });
});
