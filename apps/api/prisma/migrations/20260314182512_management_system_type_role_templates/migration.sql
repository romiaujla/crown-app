-- CreateEnum
CREATE TYPE "ManagementSystemTypeAvailabilityStatusEnum" AS ENUM ('active', 'inactive');

-- CreateTable
CREATE TABLE "management_system_types" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "type_code" TEXT NOT NULL,
    "version" TEXT NOT NULL DEFAULT '1.0',
    "display_name" TEXT NOT NULL,
    "description" TEXT,
    "availability_status" "ManagementSystemTypeAvailabilityStatusEnum" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "management_system_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "role_code" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "management_system_type_roles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "management_system_type_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "management_system_type_roles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "management_system_types_type_code_version_key" ON "management_system_types"("type_code", "version");

-- CreateIndex
CREATE UNIQUE INDEX "roles_role_code_key" ON "roles"("role_code");

-- AddForeignKey
CREATE UNIQUE INDEX "management_system_type_roles_management_system_type_id_role_id_key" ON "management_system_type_roles"("management_system_type_id", "role_id");

-- AddForeignKey
ALTER TABLE "management_system_type_roles" ADD CONSTRAINT "management_system_type_roles_management_system_type_id_fkey" FOREIGN KEY ("management_system_type_id") REFERENCES "management_system_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "management_system_type_roles" ADD CONSTRAINT "management_system_type_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
