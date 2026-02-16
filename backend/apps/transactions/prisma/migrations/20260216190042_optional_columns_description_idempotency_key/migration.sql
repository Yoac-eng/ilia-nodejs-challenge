-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "idempotency_key" DROP NOT NULL;
