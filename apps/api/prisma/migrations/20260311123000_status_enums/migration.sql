-- CreateEnum
CREATE TYPE "PlatformUserAccountStatus" AS ENUM ('active', 'disabled', 'inactive');

-- CreateEnum
CREATE TYPE "TenantStatus" AS ENUM ('active', 'inactive', 'provisioning', 'provisioning_failed');

-- AlterTable
ALTER TABLE "platform_users"
ALTER COLUMN "account_status" DROP DEFAULT,
ALTER COLUMN "account_status" TYPE "PlatformUserAccountStatus" USING ("account_status"::"PlatformUserAccountStatus"),
ALTER COLUMN "account_status" SET DEFAULT 'active';

-- AlterTable
ALTER TABLE "tenants"
ALTER COLUMN "status" DROP DEFAULT,
ALTER COLUMN "status" TYPE "TenantStatus" USING ("status"::"TenantStatus"),
ALTER COLUMN "status" SET DEFAULT 'active';
