import prisma from "../src/database"; 

    beforeEach(async () => { 
        await prisma.ticket.deleteMany({}); 
        await prisma.event.deleteMany({}); 
    }); 
        
    afterAll(async () => { 
        await prisma.$disconnect(); 
    });