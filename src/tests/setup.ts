import { prisma } from "../lib/prisma.js";
import { afterAll, beforeEach } from "vitest";


beforeEach(async () => {
  await prisma.cnae.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});