import { prisma } from "../db/prisma.js";
import { TenantStatus } from "../domain/status-enums.js";

import type { SoftDeprovisionTenantInput, SoftDeprovisionTenantResult } from "./types.js";

type TenantLifecyclePrismaClient = {
  tenant: {
    findUnique(args: {
      where: { id: string };
    }): Promise<{
      id: string;
      name: string;
      slug: string;
      schemaName: string;
      status: TenantStatus;
      createdAt: Date;
      updatedAt: Date;
    } | null>;
    update(args: {
      where: { id: string };
      data: { status: TenantStatus };
    }): Promise<{
      id: string;
      name: string;
      slug: string;
      schemaName: string;
      status: TenantStatus;
      createdAt: Date;
      updatedAt: Date;
    }>;
  };
};

// Soft deprovision is intentionally a status transition only. Session invalidation is deferred.
export const softDeprovisionTenant = async (
  input: SoftDeprovisionTenantInput,
  db: TenantLifecyclePrismaClient = prisma
): Promise<SoftDeprovisionTenantResult> => {
  const existingTenant = await db.tenant.findUnique({
    where: { id: input.tenantId }
  });

  if (!existingTenant) {
    return {
      status: "not_found",
      message: "Tenant was not found",
      tenantId: input.tenantId
    };
  }

  if (existingTenant.status === TenantStatus.inactive) {
    return {
      status: "conflict",
      message: "Tenant is already inactive",
      tenantId: existingTenant.id
    };
  }

  const updatedTenant = await db.tenant.update({
    where: { id: input.tenantId },
    data: { status: TenantStatus.inactive }
  });

  return {
    status: "soft_deprovisioned",
    tenantId: updatedTenant.id,
    slug: updatedTenant.slug,
    schemaName: updatedTenant.schemaName,
    previousStatus: existingTenant.status,
    tenant: updatedTenant
  };
};
