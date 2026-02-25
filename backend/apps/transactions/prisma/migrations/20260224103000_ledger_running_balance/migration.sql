-- CreateTable
CREATE TABLE "ledger_entries" (
    "id" TEXT NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "user_id" VARCHAR NOT NULL,
    "direction" VARCHAR NOT NULL,
    "amount_cents" BIGINT NOT NULL,
    "signed_amount_cents" BIGINT NOT NULL,
    "running_balance_cents" BIGINT NOT NULL,
    "created_at" TIMESTAMP NOT NULL,

    CONSTRAINT "ledger_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account_balances" (
    "user_id" VARCHAR NOT NULL,
    "balance_cents" BIGINT NOT NULL,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "account_balances_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ledger_entries_transaction_id_key" ON "ledger_entries"("transaction_id");

-- CreateIndex
CREATE INDEX "ledger_entries_user_id_created_at_id_idx" ON "ledger_entries"("user_id", "created_at", "id");

-- CreateIndex
CREATE INDEX "transactions_user_id_created_at_id_idx" ON "transactions"("user_id", "created_at", "id");

-- AddForeignKey
ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_entries_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Backfill ledger_entries from existing transactions.
INSERT INTO "ledger_entries" (
    "id",
    "transaction_id",
    "user_id",
    "direction",
    "amount_cents",
    "signed_amount_cents",
    "running_balance_cents",
    "created_at"
)
SELECT
    t."id",
    t."id",
    t."user_id",
    t."type",
    t."amount_cents",
    CASE
        WHEN t."type" = 'CREDIT' THEN t."amount_cents"
        ELSE -t."amount_cents"
    END AS "signed_amount_cents",
    SUM(
        CASE
            WHEN t."type" = 'CREDIT' THEN t."amount_cents"
            ELSE -t."amount_cents"
        END
    ) OVER (
        PARTITION BY t."user_id"
        ORDER BY t."created_at", t."id"
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS "running_balance_cents",
    t."created_at"
FROM "transactions" t
ON CONFLICT ("transaction_id") DO NOTHING;

-- Backfill account_balances using the latest running balance per user.
INSERT INTO "account_balances" ("user_id", "balance_cents", "updated_at")
SELECT DISTINCT ON (le."user_id")
    le."user_id",
    le."running_balance_cents",
    NOW()
FROM "ledger_entries" le
ORDER BY le."user_id", le."created_at" DESC, le."id" DESC
ON CONFLICT ("user_id") DO UPDATE
SET
    "balance_cents" = EXCLUDED."balance_cents",
    "updated_at" = EXCLUDED."updated_at";

