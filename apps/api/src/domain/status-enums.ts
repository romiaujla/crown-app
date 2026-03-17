import { PlatformUserAccountStatus, TenantStatus } from '../generated/prisma/enums.js';
import { z } from 'zod';

export { PlatformUserAccountStatus, TenantStatus };

export const PlatformUserAccountStatusSchema = z.enum(PlatformUserAccountStatus);

export const TenantStatusSchema = z.enum(TenantStatus);
