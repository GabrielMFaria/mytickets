import * as ticketsService from "../../../src/services/tickets-service"; 
import * as ticketsRepository from "../../../src/repositories/tickets-repository"; 

describe("Tickets Service", () => {
     it("getAllTickets → deve chamar repository e retornar array", async () => { 
        const mockTickets = [{ id: 1, code: "123", owner: "Gabriel", eventId: 1, used: false }]; 
        jest.spyOn(ticketsRepository, "findAllEventTickets").mockResolvedValue(mockTickets); 
        
        const result = await ticketsService.getAllTickets(1);
        expect(result).toEqual(mockTickets); 
    }); 
});