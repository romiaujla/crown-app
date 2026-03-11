-- AlterTable
ALTER TABLE "platform_users"
ADD COLUMN "account_status" TEXT NOT NULL DEFAULT 'active',
ADD COLUMN "password_hash" TEXT,
ADD COLUMN "username" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "platform_users_username_key" ON "platform_users"("username");
