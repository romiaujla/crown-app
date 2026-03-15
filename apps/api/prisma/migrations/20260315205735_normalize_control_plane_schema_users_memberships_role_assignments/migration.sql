-- CreateEnum
CREATE TYPE "PlatformRoleCodeEnum" AS ENUM ('super_admin');

-- CreateEnum
CREATE TYPE "TenantRoleCodeEnum" AS ENUM ('tenant_admin', 'tenant_user');

-- CreateEnum
CREATE TYPE "RoleAssignmentStatusEnum" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "TenantMembershipStatusEnum" AS ENUM ('active', 'inactive');

-- Preserve existing user records while normalizing the table name.
ALTER TABLE "platform_users" RENAME TO "users";
ALTER INDEX "platform_users_email_key" RENAME TO "users_email_key";
ALTER INDEX "platform_users_username_key" RENAME TO "users_username_key";
ALTER TABLE "users" ALTER COLUMN "role" DROP NOT NULL;

-- Preserve existing user-to-tenant links while separating membership from auth grants.
ALTER TABLE "platform_user_tenants" DROP CONSTRAINT "platform_user_tenants_platform_user_id_fkey";
ALTER TABLE "platform_user_tenants" DROP CONSTRAINT "platform_user_tenants_tenant_id_fkey";
ALTER TABLE "platform_user_tenants" RENAME TO "tenant_memberships";
ALTER TABLE "tenant_memberships" RENAME COLUMN "platform_user_id" TO "user_id";
ALTER INDEX "platform_user_tenants_platform_user_id_tenant_id_key" RENAME TO "tenant_memberships_user_id_tenant_id_key";
ALTER TABLE "tenant_memberships"
    ADD COLUMN "membership_status" "TenantMembershipStatusEnum" NOT NULL DEFAULT 'active',
    ADD COLUMN "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN "ended_at" TIMESTAMP(3),
    ADD COLUMN "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "tenant_memberships" ALTER COLUMN "role" DROP NOT NULL;
UPDATE "tenant_memberships"
SET
    "joined_at" = "created_at",
    "updated_at" = "created_at";
ALTER TABLE "tenant_memberships" ADD CONSTRAINT "tenant_memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "tenant_memberships" ADD CONSTRAINT "tenant_memberships_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "platform_roles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "role_code" "PlatformRoleCodeEnum" NOT NULL,
    "display_name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_platform_role_assignments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "platform_role_id" UUID NOT NULL,
    "assignment_status" "RoleAssignmentStatusEnum" NOT NULL DEFAULT 'active',
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_platform_role_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_roles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "role_code" "TenantRoleCodeEnum" NOT NULL,
    "display_name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenant_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_membership_role_assignments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_membership_id" TEXT NOT NULL,
    "tenant_role_id" UUID NOT NULL,
    "assignment_status" "RoleAssignmentStatusEnum" NOT NULL DEFAULT 'active',
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenant_membership_role_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "platform_roles_role_code_key" ON "platform_roles"("role_code");

-- CreateIndex
CREATE UNIQUE INDEX "user_platform_role_assignments_user_id_platform_role_id_key" ON "user_platform_role_assignments"("user_id", "platform_role_id");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_roles_role_code_key" ON "tenant_roles"("role_code");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_membership_role_assignments_tenant_membership_id_ten_key" ON "tenant_membership_role_assignments"("tenant_membership_id", "tenant_role_id");

-- AddForeignKey
ALTER TABLE "user_platform_role_assignments" ADD CONSTRAINT "user_platform_role_assignments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_platform_role_assignments" ADD CONSTRAINT "user_platform_role_assignments_platform_role_id_fkey" FOREIGN KEY ("platform_role_id") REFERENCES "platform_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_membership_role_assignments" ADD CONSTRAINT "tenant_membership_role_assignments_tenant_membership_id_fkey" FOREIGN KEY ("tenant_membership_id") REFERENCES "tenant_memberships"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_membership_role_assignments" ADD CONSTRAINT "tenant_membership_role_assignments_tenant_role_id_fkey" FOREIGN KEY ("tenant_role_id") REFERENCES "tenant_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Seed canonical auth roles for normalized lookups and assignment backfill.
INSERT INTO "platform_roles" ("role_code", "display_name", "description", "updated_at")
VALUES ('super_admin', 'Super Admin', 'Platform-wide operator role.', CURRENT_TIMESTAMP);

INSERT INTO "tenant_roles" ("role_code", "display_name", "description", "updated_at")
VALUES
    ('tenant_admin', 'Admin', 'Canonical tenant admin auth role.', CURRENT_TIMESTAMP),
    ('tenant_user', 'Tenant User', 'Canonical tenant user auth role for non-admin tenant personas.', CURRENT_TIMESTAMP);

-- Backfill platform role assignments from the legacy user role column.
INSERT INTO "user_platform_role_assignments" (
    "user_id",
    "platform_role_id",
    "assignment_status",
    "assigned_at",
    "created_at",
    "updated_at"
)
SELECT
    "users"."id",
    "platform_roles"."id",
    'active',
    "users"."created_at",
    "users"."created_at",
    CURRENT_TIMESTAMP
FROM "users"
JOIN "platform_roles" ON "platform_roles"."role_code" = 'super_admin'
WHERE "users"."role" = 'super_admin';

-- Backfill tenant role assignments from the legacy membership role column.
INSERT INTO "tenant_membership_role_assignments" (
    "tenant_membership_id",
    "tenant_role_id",
    "assignment_status",
    "is_primary",
    "assigned_at",
    "created_at",
    "updated_at"
)
SELECT
    "tenant_memberships"."id",
    "tenant_roles"."id",
    'active',
    true,
    "tenant_memberships"."created_at",
    "tenant_memberships"."created_at",
    CURRENT_TIMESTAMP
FROM "tenant_memberships"
JOIN "tenant_roles" ON "tenant_roles"."role_code" = CASE
    WHEN "tenant_memberships"."role" = 'tenant_admin' THEN 'tenant_admin'::"TenantRoleCodeEnum"
    ELSE 'tenant_user'::"TenantRoleCodeEnum"
END
WHERE "tenant_memberships"."role" IS NOT NULL
  AND "tenant_memberships"."role" <> 'super_admin';

-- RenameIndex
ALTER INDEX "management_system_type_roles_management_system_type_id_role_id_" RENAME TO "management_system_type_roles_management_system_type_id_role_key";
