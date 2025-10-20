import { Request, Response, NextFunction } from "express";
import handleErrorMiddleware from "../../../src/middlewares/error-middleware";

describe("handleErrorMiddleware", () => {
  const req = {} as Request;
  const res = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  } as any as Response;
  const next = jest.fn() as NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar status 404 quando o erro for not_found", () => {
    const error = { type: "not_found", message: "Recurso não encontrado" };
    handleErrorMiddleware(error, req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith(error.message);
  });

  it("deve retornar status 409 quando o erro for conflict", () => {
    const error = { type: "conflict", message: "Conflito detectado" };
    handleErrorMiddleware(error, req, res, next);
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.send).toHaveBeenCalledWith(error.message);
  });

  it("deve retornar status 403 quando o erro for forbidden", () => {
    const error = { type: "forbidden", message: "Acesso proibido" };
    handleErrorMiddleware(error, req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith(error.message);
  });

  it("deve retornar status 500 para erros genéricos", () => {
    const error = { message: "Erro desconhecido" };
    handleErrorMiddleware(error, req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Erro desconhecido"); // <-- ajustado
  });
});
