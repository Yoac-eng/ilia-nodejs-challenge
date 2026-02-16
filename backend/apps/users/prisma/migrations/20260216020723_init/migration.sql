-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "first_name" VARCHAR NOT NULL,
    "last_name" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "password_hash" VARCHAR NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
