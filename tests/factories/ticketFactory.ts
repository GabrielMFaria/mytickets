import prisma from "../../src/database"; 
import { faker } from "@faker-js/faker"; 
import { createEvent } from "./eventFactory"; 

export async function createTicket(eventId?: number) { 
    const event = eventId ? { id: eventId } : await createEvent(); 
    
    return await prisma.ticket.create({
         data: {
             code: faker.string.uuid(), 
             owner: faker.person.firstName(), 
             eventId: event.id 
            } 
        }); 
    }

export { createEvent };
