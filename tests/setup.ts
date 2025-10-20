import prisma from "../src/database";
import { cleanDatabase } from "./utils/cleanDatabase";

beforeEach(async () => {
  await cleanDatabase(); 
});

afterAll(async () => {
  await prisma.$disconnect(); 
});
