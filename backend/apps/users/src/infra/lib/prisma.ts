import 'dotenv/config';
import { PrismaClient } from '@generated/clients/users';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = `${process.env.USERS_DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };
