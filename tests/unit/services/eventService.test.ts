import * as eventsService from "../../../src/services/events-service"; 
import * as eventsRepository from "../../../src/repositories/events-repository"; 

describe("Events Service", () => { 
    it("getAllEvents → deve chamar repository e retornar array", async () => { 
        const mockEvents = [{ id: 1, name: "Evento", date: new Date() }]; 
        jest.spyOn(eventsRepository, "findAllEvents").mockResolvedValue(mockEvents); 
        
        const result = await eventsService.getAllEvents(); 
        expect(result).toEqual(mockEvents); 
    }); 
});