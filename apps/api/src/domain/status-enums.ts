import { PlatformUserAccountStatus, TenantStatus } from "../generated/prisma/enums.js";
import { z } from "zod";

export { PlatformUserAccountStatus, TenantStatus };

const platformUserAccountStatusValues = Object.values(PlatformUserAccountStatus) as [
  PlatformUserAccountStatus,
  ...PlatformUserAccountStatus[]
];

export const PlatformUserAccountStatusSchema = z.enum(platformUserAccountStatusValues);

const tenantStatusValues = Object.values(TenantStatus) as [TenantStatus, ...TenantStatus[]];

export const TenantStatusSchema = z.enum(tenantStatusValues);
