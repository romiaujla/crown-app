-- CreateEnum
CREATE TYPE "ManagementSystemTypeAvailabilityStatusEnum" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "ManagementSystemRoleTemplateBootstrapRoleEnum" AS ENUM ('none', 'tenant_admin');

-- CreateTable
CREATE TABLE "management_system_types" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "type_code" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "description" TEXT,
    "availability_status" "ManagementSystemTypeAvailabilityStatusEnum" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "management_system_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "management_system_role_templates" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "management_system_type_id" UUID NOT NULL,
    "role_code" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "description" TEXT,
    "is_required" BOOLEAN NOT NULL DEFAULT false,
    "bootstrap_role" "ManagementSystemRoleTemplateBootstrapRoleEnum" NOT NULL DEFAULT 'none',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "management_system_role_templates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "management_system_types_type_code_key" ON "management_system_types"("type_code");

-- CreateIndex
CREATE UNIQUE INDEX "management_system_role_templates_management_system_type_id__key" ON "management_system_role_templates"("management_system_type_id", "role_code");

-- AddForeignKey
ALTER TABLE "management_system_role_templates" ADD CONSTRAINT "management_system_role_templates_management_system_type_id_fkey" FOREIGN KEY ("management_system_type_id") REFERENCES "management_system_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;
