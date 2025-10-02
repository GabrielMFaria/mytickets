import prisma from "../src/database"; 
import { cleanDatabase } from "./utils/cleanDatabase";

    beforeEach(async () => { 
        await prisma.ticket.deleteMany({}); 
        await prisma.event.deleteMany({}); 
    }); 
        
    afterAll(async () => { 
        await prisma.$disconnect(); 
    });

    beforeEach(async () => { 
        await cleanDatabase(); 
    });
       
    afterAll(async () => { 
        await cleanDatabase();
     });