import prisma from "../../src/database"; 
import { faker } from "@faker-js/faker"; 

export async function createEvent() { 
    return await prisma.event.create({ 
        data: { 
            name: faker.company.name(), 
            date: faker.date.future() 
        } 
    }); 
}