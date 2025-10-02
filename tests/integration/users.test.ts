import supertest from "supertest";
import app from "../../src/app";
import { createUser } from "../factories/userFactory";
import { cleanDatabase } from "../utils/cleanDatabase";

const api = supertest(app);

beforeEach(async () => {
  await cleanDatabase();
});

describe("User routes", () => {
  it("should create a user", async () => {
    const body = { email: "test@test.com", password: "123456" };

    const response = await api.post("/users").send(body);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  it("should not allow duplicate emails", async () => {
    const user = await createUser();

    const response = await api.post("/users").send({
      email: user.email,
      password: "123456",
    });

    expect(response.status).toBe(409);
  });
});
