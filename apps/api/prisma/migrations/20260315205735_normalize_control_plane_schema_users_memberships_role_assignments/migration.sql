-- CreateEnum
CREATE TYPE "RoleScopeEnum" AS ENUM ('platform', 'tenant');

-- CreateEnum
CREATE TYPE "RoleAuthClassEnum" AS ENUM ('super_admin', 'tenant_admin', 'tenant_user');

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

-- Promote the existing roles table into the single source of truth for both auth and management-system roles.
ALTER TABLE "roles"
    ADD COLUMN "scope" "RoleScopeEnum",
    ADD COLUMN "auth_class" "RoleAuthClassEnum";

INSERT INTO "roles" ("role_code", "scope", "auth_class", "display_name", "description", "updated_at")
VALUES
    ('super_admin', 'platform', 'super_admin', 'Super Admin', 'Platform-wide operator role.', CURRENT_TIMESTAMP),
    ('admin', 'tenant', 'tenant_user', 'Admin', 'Management-system administrator role inside the tenant workspace.', CURRENT_TIMESTAMP)
ON CONFLICT ("role_code") DO NOTHING;

UPDATE "roles"
SET
    "scope" = CASE
        WHEN "role_code" = 'super_admin' THEN 'platform'::"RoleScopeEnum"
        ELSE 'tenant'::"RoleScopeEnum"
    END,
    "auth_class" = CASE
        WHEN "role_code" = 'super_admin' THEN 'super_admin'::"RoleAuthClassEnum"
        WHEN "role_code" = 'tenant_admin' THEN 'tenant_admin'::"RoleAuthClassEnum"
        ELSE 'tenant_user'::"RoleAuthClassEnum"
    END;

ALTER TABLE "roles"
    ALTER COLUMN "scope" SET NOT NULL,
    ALTER COLUMN "auth_class" SET NOT NULL;

-- CreateTable
CREATE TABLE "user_platform_role_assignments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "role_id" UUID NOT NULL,
    "assignment_status" "RoleAssignmentStatusEnum" NOT NULL DEFAULT 'active',
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_platform_role_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_membership_role_assignments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_membership_id" TEXT NOT NULL,
    "role_id" UUID NOT NULL,
    "assignment_status" "RoleAssignmentStatusEnum" NOT NULL DEFAULT 'active',
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenant_membership_role_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_platform_role_assignments_user_id_role_id_key" ON "user_platform_role_assignments"("user_id", "role_id");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_membership_role_assignments_tenant_membership_id_rol_key" ON "tenant_membership_role_assignments"("tenant_membership_id", "role_id");

-- AddForeignKey
ALTER TABLE "user_platform_role_assignments" ADD CONSTRAINT "user_platform_role_assignments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_platform_role_assignments" ADD CONSTRAINT "user_platform_role_assignments_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_membership_role_assignments" ADD CONSTRAINT "tenant_membership_role_assignments_tenant_membership_id_fkey" FOREIGN KEY ("tenant_membership_id") REFERENCES "tenant_memberships"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_membership_role_assignments" ADD CONSTRAINT "tenant_membership_role_assignments_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill direct user role assignments from the legacy user role column.
INSERT INTO "user_platform_role_assignments" (
    "user_id",
    "role_id",
    "assignment_status",
    "assigned_at",
    "created_at",
    "updated_at"
)
SELECT
    "users"."id",
    "roles"."id",
    'active',
    "users"."created_at",
    "users"."created_at",
    CURRENT_TIMESTAMP
FROM "users"
JOIN "roles" ON "roles"."role_code" = "users"."role"
WHERE "users"."role" IS NOT NULL;

-- Backfill tenant membership role assignments from the legacy membership role column.
-- Legacy generic tenant users are mapped to `dispatcher` as the baseline tenant-user-class role in the normalized catalog.
INSERT INTO "tenant_membership_role_assignments" (
    "tenant_membership_id",
    "role_id",
    "assignment_status",
    "is_primary",
    "assigned_at",
    "created_at",
    "updated_at"
)
SELECT
    "tenant_memberships"."id",
    "roles"."id",
    'active',
    true,
    "tenant_memberships"."created_at",
    "tenant_memberships"."created_at",
    CURRENT_TIMESTAMP
FROM "tenant_memberships"
JOIN "roles" ON "roles"."role_code" = CASE
    WHEN "tenant_memberships"."role" = 'tenant_user' THEN 'dispatcher'
    ELSE "tenant_memberships"."role"
END
WHERE "tenant_memberships"."role" IS NOT NULL
  AND "tenant_memberships"."role" <> 'super_admin';

-- RenameIndex
ALTER INDEX "management_system_type_roles_management_system_type_id_role_id_" RENAME TO "management_system_type_roles_management_system_type_id_role_key";
