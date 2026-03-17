import { z } from 'zod';

export enum RoleCodeEnum {
  ADMIN = 'admin',
  TENANT_ADMIN = 'tenant_admin',
  DISPATCHER = 'dispatcher',
  ACCOUNTANT = 'accountant',
  HUMAN_RESOURCES = 'human_resources',
  DRIVER = 'driver',
}

export const RoleCodeSchema = z.enum(RoleCodeEnum);
export type RoleCode = z.infer<typeof RoleCodeSchema>;

export enum DashboardMetricWindowEnum {
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}

export const DashboardMetricWindowSchema = z.enum(DashboardMetricWindowEnum);
export type DashboardMetricWindow = z.infer<typeof DashboardMetricWindowSchema>;

export enum TenantStatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PROVISIONING = 'provisioning',
  PROVISIONING_FAILED = 'provisioning_failed',
  HARD_DEPROVISIONED = 'hard_deprovisioned',
}

export const TenantStatusSchema = z.enum(TenantStatusEnum);

export enum ManagementSystemTypeCodeEnum {
  TRANSPORTATION = 'transportation',
  DEALERSHIP = 'dealership',
  INVENTORY = 'inventory',
}

export const ManagementSystemTypeCodeSchema = z.enum(ManagementSystemTypeCodeEnum);
export type ManagementSystemTypeCode = z.infer<typeof ManagementSystemTypeCodeSchema>;

export const TenantDirectoryListFilterSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    status: TenantStatusSchema.optional(),
  })
  .strict();
export type TenantDirectoryListFilter = {
  name?: string;
  status?: TenantStatusEnum;
};

export const TenantDirectoryListRequestSchema = z
  .object({
    filters: TenantDirectoryListFilterSchema.default({}),
  })
  .strict();
export type TenantDirectoryListRequest = {
  filters: TenantDirectoryListFilter;
};

export const TenantDirectoryListItemSchema = z.object({
  tenantId: z.string(),
  name: z.string(),
  slug: z.string(),
  schemaName: z.string(),
  status: TenantStatusSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type TenantDirectoryListItem = {
  tenantId: string;
  name: string;
  slug: string;
  schemaName: string;
  status: TenantStatusEnum;
  createdAt: string;
  updatedAt: string;
};

export const TenantDirectoryListDataSchema = z.object({
  tenantList: z.array(TenantDirectoryListItemSchema),
});
export type TenantDirectoryListData = {
  tenantList: TenantDirectoryListItem[];
};

export const TenantDirectoryListFiltersSchema = z.object({
  name: z.string().nullable(),
  status: TenantStatusSchema.nullable(),
});
export type TenantDirectoryListFilters = {
  name: string | null;
  status: TenantStatusEnum | null;
};

export const TenantDirectoryListMetaSchema = z.object({
  totalRecords: z.number().int().nonnegative(),
  filters: TenantDirectoryListFiltersSchema,
});
export type TenantDirectoryListMeta = {
  totalRecords: number;
  filters: TenantDirectoryListFilters;
};

export const TenantDirectoryListResponseSchema = z.object({
  data: TenantDirectoryListDataSchema,
  meta: TenantDirectoryListMetaSchema,
});
export type TenantDirectoryListResponse = {
  data: TenantDirectoryListData;
  meta: TenantDirectoryListMeta;
};

export const TenantCreateRoleOptionSchema = z.object({
  roleCode: RoleCodeSchema,
  displayName: z.string(),
  description: z.string().nullable(),
  isDefault: z.boolean(),
  isRequired: z.boolean(),
});
export type TenantCreateRoleOption = z.infer<typeof TenantCreateRoleOptionSchema>;

export const TenantCreateReferenceDataFilterSchema = z
  .object({
    typeCode: ManagementSystemTypeCodeSchema.optional(),
  })
  .strict();
export type TenantCreateReferenceDataFilter = z.infer<typeof TenantCreateReferenceDataFilterSchema>;

export const TenantCreateReferenceDataRequestSchema = z
  .object({
    filter: TenantCreateReferenceDataFilterSchema.default({}),
  })
  .strict();
export type TenantCreateReferenceDataRequest = z.infer<
  typeof TenantCreateReferenceDataRequestSchema
>;

export const TenantCreateManagementSystemTypeSchema = z.object({
  typeCode: ManagementSystemTypeCodeSchema,
  version: z.string(),
  displayName: z.string(),
  description: z.string().nullable(),
  roleOptions: z.array(TenantCreateRoleOptionSchema),
});
export type TenantCreateManagementSystemType = z.infer<
  typeof TenantCreateManagementSystemTypeSchema
>;

export const TenantCreateReferenceDataSchema = z.object({
  managementSystemTypeList: z.array(TenantCreateManagementSystemTypeSchema),
});
export type TenantCreateReferenceData = z.infer<typeof TenantCreateReferenceDataSchema>;

export const TenantCreateReferenceDataResponseSchema = z.object({
  data: TenantCreateReferenceDataSchema,
});
export type TenantCreateReferenceDataResponse = z.infer<
  typeof TenantCreateReferenceDataResponseSchema
>;

export enum DeprovisionTypeEnum {
  HARD = 'hard',
  SOFT = 'soft',
}

export const DeprovisionTypeSchema = z.enum(DeprovisionTypeEnum);

export const TenantStatusCountEntrySchema = z.object({
  status: TenantStatusSchema,
  count: z.number().int().nonnegative(),
});
export type TenantStatusCountEntry = z.infer<typeof TenantStatusCountEntrySchema>;

export const NewTenantCountMetricSchema = z.object({
  window: DashboardMetricWindowSchema,
  count: z.number().int().nonnegative(),
});
export type NewTenantCountMetric = z.infer<typeof NewTenantCountMetricSchema>;

export const TenantGrowthRateMetricSchema = z.object({
  window: DashboardMetricWindowSchema,
  growthRatePercentage: z.number(),
});
export type TenantGrowthRateMetric = z.infer<typeof TenantGrowthRateMetricSchema>;

export const TenantSummaryWidgetSchema = z.object({
  totalTenantCount: z.number().int().nonnegative(),
  tenantUserCount: z.number().int().nonnegative(),
  tenantStatusCounts: z.array(TenantStatusCountEntrySchema),
  newTenantCounts: z.array(NewTenantCountMetricSchema),
  tenantGrowthRates: z.array(TenantGrowthRateMetricSchema),
});
export type TenantSummaryWidget = z.infer<typeof TenantSummaryWidgetSchema>;

export const DashboardOverviewWidgetsSchema = z.object({
  tenantSummary: TenantSummaryWidgetSchema,
});
export type DashboardOverviewWidgets = z.infer<typeof DashboardOverviewWidgetsSchema>;

export const DashboardOverviewResponseSchema = z.object({
  widgets: DashboardOverviewWidgetsSchema,
});
export type DashboardOverviewResponse = z.infer<typeof DashboardOverviewResponseSchema>;

// ── CROWN-156: User & Role Management Contracts ──────────────────────────────

export enum PlatformUserAccountStatusEnum {
  ACTIVE = 'active',
  DISABLED = 'disabled',
  INACTIVE = 'inactive',
}

export const PlatformUserAccountStatusSchema = z.enum(PlatformUserAccountStatusEnum);

export enum RoleAuthClassEnum {
  SUPER_ADMIN = 'super_admin',
  TENANT_ADMIN = 'tenant_admin',
  TENANT_USER = 'tenant_user',
}

export const RoleAuthClassSchema = z.enum(RoleAuthClassEnum);

export enum RoleScopeEnum {
  PLATFORM = 'platform',
  TENANT = 'tenant',
}

export const RoleScopeSchema = z.enum(RoleScopeEnum);

export enum RoleAssignmentStatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export const RoleAssignmentStatusSchema = z.enum(RoleAssignmentStatusEnum);

export enum TenantMembershipStatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export const TenantMembershipStatusSchema = z.enum(TenantMembershipStatusEnum);

// ── Platform User Search ─────────────────────────────────────────────────────

export const PlatformUserSearchFilterSchema = z
  .object({
    search: z.string().trim().min(1).max(200).optional(),
    accountStatus: PlatformUserAccountStatusSchema.optional(),
  })
  .strict();
export type PlatformUserSearchFilter = z.infer<typeof PlatformUserSearchFilterSchema>;

export const PlatformUserSearchRequestSchema = z
  .object({
    filters: PlatformUserSearchFilterSchema.default({}),
    page: z.number().int().positive().default(1),
    pageSize: z.number().int().positive().max(100).default(25),
  })
  .strict();
export type PlatformUserSearchRequest = z.infer<typeof PlatformUserSearchRequestSchema>;

export const PlatformUserListItemSchema = z.object({
  userId: z.string(),
  email: z.string(),
  username: z.string().nullable(),
  displayName: z.string(),
  accountStatus: PlatformUserAccountStatusSchema,
  platformRoles: z.array(z.string()),
  tenantMembershipCount: z.number().int().nonnegative(),
  createdAt: z.string().datetime(),
});
export type PlatformUserListItem = z.infer<typeof PlatformUserListItemSchema>;

export const PlatformUserSearchDataSchema = z.object({
  userList: z.array(PlatformUserListItemSchema),
});

export const PlatformUserSearchFiltersSchema = z.object({
  search: z.string().nullable(),
  accountStatus: PlatformUserAccountStatusSchema.nullable(),
});

export const PlatformUserSearchMetaSchema = z.object({
  totalRecords: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  filters: PlatformUserSearchFiltersSchema,
});

export const PlatformUserSearchResponseSchema = z.object({
  data: PlatformUserSearchDataSchema,
  meta: PlatformUserSearchMetaSchema,
});
export type PlatformUserSearchResponse = z.infer<typeof PlatformUserSearchResponseSchema>;

// ── Platform User Detail ─────────────────────────────────────────────────────

export const PlatformRoleAssignmentSchema = z.object({
  assignmentId: z.string(),
  roleCode: z.string(),
  displayName: z.string(),
  authClass: RoleAuthClassSchema,
  assignmentStatus: RoleAssignmentStatusSchema,
  assignedAt: z.string().datetime(),
});
export type PlatformRoleAssignment = z.infer<typeof PlatformRoleAssignmentSchema>;

export const TenantMembershipRoleAssignmentSummarySchema = z.object({
  assignmentId: z.string(),
  roleCode: z.string(),
  displayName: z.string(),
  authClass: RoleAuthClassSchema,
  assignmentStatus: RoleAssignmentStatusSchema,
  isPrimary: z.boolean(),
  assignedAt: z.string().datetime(),
});
export type TenantMembershipRoleAssignmentSummary = z.infer<
  typeof TenantMembershipRoleAssignmentSummarySchema
>;

export const TenantMembershipSummarySchema = z.object({
  membershipId: z.string(),
  tenantId: z.string(),
  tenantName: z.string(),
  tenantSlug: z.string(),
  membershipStatus: TenantMembershipStatusSchema,
  joinedAt: z.string().datetime(),
  roleAssignments: z.array(TenantMembershipRoleAssignmentSummarySchema),
});
export type TenantMembershipSummary = z.infer<typeof TenantMembershipSummarySchema>;

export const PlatformUserDetailSchema = z.object({
  userId: z.string(),
  email: z.string(),
  username: z.string().nullable(),
  displayName: z.string(),
  accountStatus: PlatformUserAccountStatusSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  platformRoleAssignments: z.array(PlatformRoleAssignmentSchema),
  tenantMemberships: z.array(TenantMembershipSummarySchema),
});
export type PlatformUserDetail = z.infer<typeof PlatformUserDetailSchema>;

export const PlatformUserDetailRequestSchema = z
  .object({
    userId: z.string().min(1),
  })
  .strict();
export type PlatformUserDetailRequest = z.infer<typeof PlatformUserDetailRequestSchema>;

export const PlatformUserDetailResponseSchema = z.object({
  data: PlatformUserDetailSchema,
});
export type PlatformUserDetailResponse = z.infer<typeof PlatformUserDetailResponseSchema>;

// ── Create Tenant Membership ─────────────────────────────────────────────────

export const CreateTenantMembershipRequestSchema = z
  .object({
    userId: z.string().min(1),
    tenantId: z.string().min(1),
    roleCode: RoleCodeSchema,
  })
  .strict();
export type CreateTenantMembershipRequest = z.infer<typeof CreateTenantMembershipRequestSchema>;

export const CreateTenantMembershipDataSchema = z.object({
  membershipId: z.string(),
  userId: z.string(),
  tenantId: z.string(),
  roleCode: z.string(),
  membershipStatus: TenantMembershipStatusSchema,
  assignmentStatus: RoleAssignmentStatusSchema,
  isPrimary: z.boolean(),
});

export const CreateTenantMembershipResponseSchema = z.object({
  data: CreateTenantMembershipDataSchema,
});
export type CreateTenantMembershipResponse = z.infer<typeof CreateTenantMembershipResponseSchema>;

// ── Tenant Member Search ─────────────────────────────────────────────────────

export const TenantMemberSearchFilterSchema = z
  .object({
    search: z.string().trim().min(1).max(200).optional(),
    roleCode: RoleCodeSchema.optional(),
  })
  .strict();
export type TenantMemberSearchFilter = z.infer<typeof TenantMemberSearchFilterSchema>;

export const TenantMemberSearchRequestSchema = z
  .object({
    filters: TenantMemberSearchFilterSchema.default({}),
    page: z.number().int().positive().default(1),
    pageSize: z.number().int().positive().max(100).default(25),
  })
  .strict();
export type TenantMemberSearchRequest = z.infer<typeof TenantMemberSearchRequestSchema>;

export const TenantMemberListItemSchema = z.object({
  membershipId: z.string(),
  userId: z.string(),
  email: z.string(),
  username: z.string().nullable(),
  displayName: z.string(),
  accountStatus: PlatformUserAccountStatusSchema,
  membershipStatus: TenantMembershipStatusSchema,
  joinedAt: z.string().datetime(),
  roleAssignments: z.array(TenantMembershipRoleAssignmentSummarySchema),
});
export type TenantMemberListItem = z.infer<typeof TenantMemberListItemSchema>;

export const TenantMemberSearchDataSchema = z.object({
  memberList: z.array(TenantMemberListItemSchema),
});

export const TenantMemberSearchFiltersSchema = z.object({
  search: z.string().nullable(),
  roleCode: z.string().nullable(),
});

export const TenantMemberSearchMetaSchema = z.object({
  totalRecords: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  filters: TenantMemberSearchFiltersSchema,
});

export const TenantMemberSearchResponseSchema = z.object({
  data: TenantMemberSearchDataSchema,
  meta: TenantMemberSearchMetaSchema,
});
export type TenantMemberSearchResponse = z.infer<typeof TenantMemberSearchResponseSchema>;

// ── Assign Tenant Member Role ────────────────────────────────────────────────

export const AssignTenantMemberRoleRequestSchema = z
  .object({
    membershipId: z.string().min(1),
    roleCode: RoleCodeSchema,
  })
  .strict();
export type AssignTenantMemberRoleRequest = z.infer<typeof AssignTenantMemberRoleRequestSchema>;

export const AssignTenantMemberRoleDataSchema = z.object({
  assignmentId: z.string(),
  membershipId: z.string(),
  roleCode: z.string(),
  displayName: z.string(),
  assignmentStatus: RoleAssignmentStatusSchema,
  isPrimary: z.boolean(),
  assignedAt: z.string().datetime(),
});

export const AssignTenantMemberRoleResponseSchema = z.object({
  data: AssignTenantMemberRoleDataSchema,
});
export type AssignTenantMemberRoleResponse = z.infer<typeof AssignTenantMemberRoleResponseSchema>;

// ── Revoke Tenant Member Role ────────────────────────────────────────────────

export const RevokeTenantMemberRoleRequestSchema = z
  .object({
    membershipId: z.string().min(1),
    roleCode: RoleCodeSchema,
  })
  .strict();
export type RevokeTenantMemberRoleRequest = z.infer<typeof RevokeTenantMemberRoleRequestSchema>;

export const RevokeTenantMemberRoleDataSchema = z.object({
  assignmentId: z.string(),
  membershipId: z.string(),
  roleCode: z.string(),
  assignmentStatus: RoleAssignmentStatusSchema,
  endedAt: z.string().datetime(),
});

export const RevokeTenantMemberRoleResponseSchema = z.object({
  data: RevokeTenantMemberRoleDataSchema,
});
export type RevokeTenantMemberRoleResponse = z.infer<typeof RevokeTenantMemberRoleResponseSchema>;

// ── Tenant Role Listing ──────────────────────────────────────────────────────

export const TenantRoleItemSchema = z.object({
  roleCode: z.string(),
  displayName: z.string(),
  description: z.string().nullable(),
  authClass: RoleAuthClassSchema,
  scope: RoleScopeSchema,
});
export type TenantRoleItem = z.infer<typeof TenantRoleItemSchema>;

export const TenantRoleListDataSchema = z.object({
  roles: z.array(TenantRoleItemSchema),
});

export const TenantRoleListResponseSchema = z.object({
  data: TenantRoleListDataSchema,
});
export type TenantRoleListResponse = z.infer<typeof TenantRoleListResponseSchema>;
