import { isIdParamValid } from "../../../src/utils";

describe("utils/index.ts → isIdParamValid", () => {
  it("deve retornar o id como número se for válido", () => {
    const result = isIdParamValid("10");
    expect(result).toBe(10);
  });

  it("deve lançar erro se o id não for número", () => {
    try {
      isIdParamValid("abc");
      fail("Deveria ter lançado erro");
    } catch (err: any) {
      expect(err).toEqual({
        type: "bad_request",
        message: "Invalid id.",
      });
    }
  });

  it("deve lançar erro se o id for menor ou igual a zero", () => {
    try {
      isIdParamValid("0");
      fail("Deveria ter lançado erro");
    } catch (err: any) {
      expect(err).toEqual({
        type: "bad_request",
        message: "Invalid id.",
      });
    }
  });
});
