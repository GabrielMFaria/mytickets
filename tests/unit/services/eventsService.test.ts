import * as eventsService from "../../../src/services/events-service";
import * as eventsRepository from "../../../src/repositories/events-repository";

describe("Events Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getAllEvents → deve chamar repository e retornar array", async () => {
    const mockEvents = [{ id: 1, name: "Evento", date: new Date() }];
    jest.spyOn(eventsRepository, "findAllEvents").mockResolvedValue(mockEvents);

    const result = await eventsService.getAllEvents();
    expect(result).toEqual(mockEvents);
  });

  it("getSpecificEvent → deve lançar erro se não encontrar evento", async () => {
    jest.spyOn(eventsRepository, "findEventById").mockResolvedValue(null);

    await expect(eventsService.getSpecificEvent(1)).rejects.toEqual({
      type: "not_found",
      message: "Event with id 1 not found.",
    });
  });

  it("createNewEvent → deve lançar erro se nome já existir", async () => {
    jest.spyOn(eventsRepository, "findEventByName").mockResolvedValue({
      id: 1,
      name: "Festival",
      date: new Date(),
    });

    const data = { name: "Festival", date: new Date() };
    await expect(eventsService.createNewEvent(data)).rejects.toEqual({
      type: "conflict",
      message: "Event with name Festival already registered.",
    });
  });

  it("createNewEvent → deve criar evento se nome for único", async () => {
    jest.spyOn(eventsRepository, "findEventByName").mockResolvedValue(null);
    jest.spyOn(eventsRepository, "saveEvent").mockResolvedValue({
      id: 1,
      name: "NovoEvento",
      date: new Date(),
    });

    const result = await eventsService.createNewEvent({
      name: "NovoEvento",
      date: new Date(),
    });
    expect(result.id).toBe(1);
  });

  it("changeEvent → deve lançar erro se id não existir", async () => {
    jest.spyOn(eventsRepository, "findEventById").mockResolvedValue(null);
    await expect(
      eventsService.changeEvent({ name: "A", date: new Date() }, 10)
    ).rejects.toEqual({
      type: "not_found",
      message: "Event with id 10 not found.",
    });
  });

  it("removeEvent → deve chamar deleteEvent após validação", async () => {
    jest.spyOn(eventsRepository, "findEventById").mockResolvedValue({
      id: 1,
      name: "Festival",
      date: new Date(),
    });
    const deleteSpy = jest
    .spyOn(eventsRepository, "deleteEvent")
    .mockResolvedValue({ id: 1, name: "Festival", date: new Date() });

    await eventsService.removeEvent(1);
    expect(deleteSpy).toHaveBeenCalledWith(1);
  });
});
