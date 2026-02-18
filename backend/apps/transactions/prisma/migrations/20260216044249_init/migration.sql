-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEBIT', 'CREDIT');

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "user_id" VARCHAR NOT NULL,
    "type" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    "amount_cents" BIGINT NOT NULL,
    "idempotency_key" VARCHAR NOT NULL,
    "created_at" TIMESTAMP NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transactions_idempotency_key_key" ON "transactions"("idempotency_key");
