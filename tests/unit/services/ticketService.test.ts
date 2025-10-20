import * as ticketsService from "../../../src/services/tickets-service";
import * as ticketsRepository from "../../../src/repositories/tickets-repository";
import * as eventsService from "../../../src/services/events-service";

describe("Tickets Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getAllTickets → deve retornar todos os tickets do evento", async () => {
    const mockTickets = [
      { id: 1, code: "123", owner: "Gabriel", eventId: 1, used: false },
    ];
    jest
      .spyOn(ticketsRepository, "findAllEventTickets")
      .mockResolvedValue(mockTickets as any);

    const result = await ticketsService.getAllTickets(1);
    expect(result).toEqual(mockTickets);
  });

  it("createNewTicket → deve lançar erro se o evento já aconteceu", async () => {
    jest.spyOn(eventsService, "getSpecificEvent").mockResolvedValue({
      id: 1,
      name: "AntigoEvento",
      date: new Date(Date.now() - 10000),
    } as any);

    const data = { code: "ABC", owner: "João", eventId: 1 };
    await expect(ticketsService.createNewTicket(data)).rejects.toEqual({
      type: "forbidden",
      message: "The event has already happened.",
    });
  });

  it("createNewTicket → deve lançar erro se ticket já existir", async () => {
    jest.spyOn(eventsService, "getSpecificEvent").mockResolvedValue({
      id: 1,
      name: "Evento",
      date: new Date(Date.now() + 10000),
    } as any);

    jest
      .spyOn(ticketsRepository, "findTicketByCodeForEvent")
      .mockResolvedValue({
        id: 1,
        owner: "Pedro",
        code: "AAA",
        eventId: 1,
        used: false,
      } as any);

    const data = { code: "AAA", owner: "Pedro", eventId: 1 };
    await expect(ticketsService.createNewTicket(data)).rejects.toEqual({
      type: "conflict",
      message: "Ticket with code AAA for event id 1 already registered.",
    });
  });

  it("createNewTicket → deve criar ticket se tudo ok", async () => {
    jest.spyOn(eventsService, "getSpecificEvent").mockResolvedValue({
      id: 1,
      name: "Show",
      date: new Date(Date.now() + 10000),
    } as any);

    jest
      .spyOn(ticketsRepository, "findTicketByCodeForEvent")
      .mockResolvedValue(null);

    jest.spyOn(ticketsRepository, "saveTicket").mockResolvedValue({
      id: 1,
      owner: "Lucas",
      code: "XYZ",
      eventId: 1,
      used: false,
    } as any);

    const result = await ticketsService.createNewTicket({
      code: "XYZ",
      owner: "Lucas",
      eventId: 1,
    });

    expect(result.id).toBe(1);
  });

  it("useTicket → deve lançar erro se ticket não for encontrado", async () => {
    jest.spyOn(ticketsRepository, "findTicketById").mockResolvedValue(null);

    await expect(ticketsService.useTicket(10)).rejects.toEqual({
      type: "not_found",
      message: "Ticket with id 10 not found.",
    });
  });

  it("useTicket → deve lançar erro se evento expirado ou ticket já usado", async () => {
    const event = { id: 1, name: "Show", date: new Date(Date.now() - 10000) };
    const ticket = {
      id: 1,
      owner: "Maria",
      code: "ABC123",
      eventId: 1,
      used: true,
      Event: event,
    };
    jest.spyOn(ticketsRepository, "findTicketById").mockResolvedValue(ticket as any);

    await expect(ticketsService.useTicket(1)).rejects.toEqual({
      type: "forbidden",
      message: "The event has already happened or ticket was already used.",
    });
  });

  it("useTicket → deve marcar ticket como usado se válido", async () => {
    const event = { id: 1, name: "Show", date: new Date(Date.now() + 10000) };
    const ticket = {
      id: 1,
      owner: "Ana",
      code: "XYZ999",
      eventId: 1,
      used: false,
      Event: event,
    };
    jest.spyOn(ticketsRepository, "findTicketById").mockResolvedValue(ticket as any);

    const updateSpy = jest
      .spyOn(ticketsRepository, "updateTicketUse")
      .mockResolvedValue({ ...ticket, used: true } as any);

    await ticketsService.useTicket(1);
    expect(updateSpy).toHaveBeenCalledWith(1);
  });
});
