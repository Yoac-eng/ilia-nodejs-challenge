import 'dotenv/config';
import { PrismaClient } from '@generated/clients/transactions';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = `${process.env.TRANSACTIONS_DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };
