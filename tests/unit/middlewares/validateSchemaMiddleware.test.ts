import { Request, Response, NextFunction } from "express";
import { validateSchema } from "../../../src/middlewares/schema-middleware";
import Joi from "joi";

describe("validateSchema", () => {
  const schema = Joi.object({
    name: Joi.string().required(),
    age: Joi.number().required(),
  });

  const res = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  } as any as Response;

  const next = jest.fn() as NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve chamar next() se o corpo for válido", () => {
    const req = { body: { name: "Gabriel", age: 25 } } as Request;
    const middleware = validateSchema(schema);

    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("deve retornar 422 se o corpo for inválido", () => {
    const req = { body: { name: "Gabriel" } } as Request;
    const middleware = validateSchema(schema);

    middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.send).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });
});
