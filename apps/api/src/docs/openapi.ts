import {
  DashboardMetricWindowEnum,
  DeprovisionTypeEnum,
  ManagementSystemTypeCodeEnum,
  PlatformUserAccountStatusEnum,
  RoleAssignmentStatusEnum,
  RoleAuthClassEnum,
  RoleCodeEnum,
  RoleScopeEnum,
  TenantMembershipStatusEnum,
  TenantStatusEnum,
} from '@crown/types';
import { AuthErrorCodeEnum, RoleEnum, TenantRoleEnum } from '../auth/claims.js';
import {
  AuthRoutingReasonCodeEnum,
  AuthRoutingStatusEnum,
  AuthTargetAppEnum,
} from '../auth/service.js';
import { PlatformUserAccountStatus } from '../domain/status-enums.js';

const bearerSecurity = [{ bearerAuth: [] }];
const authErrorCodeValues = Object.values(AuthErrorCodeEnum);
const roleValues = Object.values(RoleEnum);
const tenantRoleValues = Object.values(TenantRoleEnum);
const authRoutingStatusValues = Object.values(AuthRoutingStatusEnum);
const authRoutingReasonCodeValues = Object.values(AuthRoutingReasonCodeEnum);
const authTargetAppValues = Object.values(AuthTargetAppEnum);
const platformUserAccountStatusValues = Object.values(PlatformUserAccountStatus);
const tenantStatusValues = Object.values(TenantStatusEnum);
const managementSystemTypeCodeValues = Object.values(ManagementSystemTypeCodeEnum);
const roleCodeValues = Object.values(RoleCodeEnum);
const deprovisionTypeValues = Object.values(DeprovisionTypeEnum);
const dashboardMetricWindowValues = Object.values(DashboardMetricWindowEnum);
const roleAuthClassValues = Object.values(RoleAuthClassEnum);
const roleScopeValues = Object.values(RoleScopeEnum);
const roleAssignmentStatusValues = Object.values(RoleAssignmentStatusEnum);
const tenantMembershipStatusValues = Object.values(TenantMembershipStatusEnum);
const platformUserAccountStatusEnumValues = Object.values(PlatformUserAccountStatusEnum);

const errorResponse = (description: string, errorCode: string, message: string) => ({
  description,
  content: {
    'application/json': {
      schema: { $ref: '#/components/schemas/ErrorResponse' },
      examples: {
        default: {
          value: {
            errorCode: errorCode,
            message,
          },
        },
      },
    },
  },
});

export const authDocsDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Crown API Docs',
    version: '0.1.0',
    description: 'Local/dev-first Swagger UI for the auth-bearing API surface.',
  },
  servers: [{ url: '/' }],
  tags: [
    { name: 'Auth', description: 'Authentication and current-user endpoints.' },
    {
      name: 'Authorization',
      description: 'Protected route examples for platform and tenant access.',
    },
    {
      name: 'Platform Dashboard',
      description: 'Super-admin dashboard overview widgets and summary data.',
    },
    {
      name: 'Platform Tenants',
      description:
        'Tenant reference-data, directory, provisioning, and deprovision routes protected for super admins.',
    },
    {
      name: 'Platform Users',
      description:
        'User directory, detail, and membership management routes protected for super admins.',
    },
    {
      name: 'Tenant Members',
      description:
        'Tenant member directory, role assignment, role revocation, and role catalog routes protected for tenant admins.',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      Role: {
        type: 'string',
        enum: roleValues,
        description:
          'The auth_class dimension from the normalized roles table. Maps platform and tenant role assignments to the JWT claim level: super_admin (platform operator), tenant_admin (tenant shell admin), tenant_user (tenant workspace member).',
      },
      PlatformUserAccountStatus: {
        type: 'string',
        enum: platformUserAccountStatusValues,
      },
      JwtClaims: {
        type: 'object',
        description:
          'Access-token claims. The role field is derived from the roles.auth_class column via the normalized role-assignment tables during authentication.',
        required: ['sub', 'role', 'tenant_id', 'exp'],
        properties: {
          sub: { type: 'string' },
          role: { $ref: '#/components/schemas/Role' },
          tenant_id: { type: 'string', nullable: true },
          exp: {
            type: 'integer',
            format: 'int64',
            description: 'Unix timestamp in seconds when the access token expires.',
          },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['identifier', 'password'],
        properties: {
          identifier: {
            type: 'string',
            minLength: 3,
            description: 'Username or email address.',
          },
          password: {
            type: 'string',
            minLength: 8,
          },
        },
      },
      TenantAccessRequest: {
        type: 'object',
        required: ['authClass', 'tenantId'],
        properties: {
          authClass: {
            type: 'string',
            enum: tenantRoleValues,
          },
          tenantId: {
            type: 'string',
            minLength: 1,
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        required: ['errorCode', 'message'],
        properties: {
          errorCode: {
            type: 'string',
            enum: authErrorCodeValues,
          },
          message: { type: 'string' },
          routing: { $ref: '#/components/schemas/AuthRouting' },
        },
      },
      AuthRouting: {
        type: 'object',
        required: ['status', 'targetApp', 'reasonCode'],
        properties: {
          status: {
            type: 'string',
            enum: authRoutingStatusValues,
          },
          targetApp: {
            type: 'string',
            nullable: true,
            enum: authTargetAppValues,
          },
          reasonCode: {
            type: 'string',
            nullable: true,
            enum: authRoutingReasonCodeValues,
          },
        },
      },
      CurrentUserPrincipal: {
        type: 'object',
        required: ['id', 'email', 'username', 'displayName', 'role', 'accountStatus'],
        properties: {
          id: { type: 'string' },
          email: { type: 'string', format: 'email' },
          username: { type: 'string', nullable: true },
          displayName: { type: 'string' },
          role: { $ref: '#/components/schemas/Role' },
          accountStatus: { $ref: '#/components/schemas/PlatformUserAccountStatus' },
        },
      },
      CurrentUserRoleContext: {
        type: 'object',
        required: ['role', 'tenantId'],
        properties: {
          role: { $ref: '#/components/schemas/Role' },
          tenantId: { type: 'string', nullable: true },
        },
      },
      CurrentUserTenant: {
        nullable: true,
        oneOf: [
          {
            type: 'object',
            required: ['id', 'slug', 'name', 'role'],
            properties: {
              id: { type: 'string' },
              slug: { type: 'string' },
              name: { type: 'string' },
              role: {
                type: 'string',
                enum: tenantRoleValues,
              },
            },
          },
        ],
      },
      CurrentUserResponse: {
        type: 'object',
        required: ['principal', 'roleContext', 'tenant', 'targetApp', 'routing'],
        properties: {
          principal: { $ref: '#/components/schemas/CurrentUserPrincipal' },
          roleContext: { $ref: '#/components/schemas/CurrentUserRoleContext' },
          tenant: { $ref: '#/components/schemas/CurrentUserTenant' },
          targetApp: {
            type: 'string',
            enum: authTargetAppValues,
          },
          routing: { $ref: '#/components/schemas/AuthRouting' },
        },
      },
      AccessTokenResponse: {
        type: 'object',
        required: ['accessToken', 'claims', 'currentUser'],
        properties: {
          accessToken: { type: 'string' },
          claims: { $ref: '#/components/schemas/JwtClaims' },
          currentUser: { $ref: '#/components/schemas/CurrentUserResponse' },
        },
      },
      TenantProvisionRequest: {
        type: 'object',
        required: ['name', 'slug', 'managementSystemTypeCode'],
        properties: {
          name: {
            type: 'string',
            minLength: 2,
            maxLength: 120,
          },
          slug: {
            type: 'string',
            pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
            description: 'Lowercase kebab-case tenant slug.',
          },
          managementSystemTypeCode: {
            type: 'string',
            enum: managementSystemTypeCodeValues,
            description: 'Management system type to apply as the tenant role template.',
          },
        },
      },
      TenantProvisionResponse: {
        type: 'object',
        required: [
          'tenantId',
          'slug',
          'schemaName',
          'appliedVersions',
          'managementSystemTypeCode',
          'status',
        ],
        properties: {
          tenantId: { type: 'string' },
          slug: { type: 'string' },
          schemaName: { type: 'string' },
          appliedVersions: {
            type: 'array',
            items: { type: 'string' },
          },
          managementSystemTypeCode: {
            type: 'string',
            enum: managementSystemTypeCodeValues,
          },
          status: {
            type: 'string',
            enum: ['provisioned'],
          },
        },
      },
      TenantDirectoryListItem: {
        type: 'object',
        required: ['tenantId', 'name', 'slug', 'schemaName', 'status', 'createdAt', 'updatedAt'],
        properties: {
          tenantId: { type: 'string' },
          name: { type: 'string' },
          slug: { type: 'string' },
          schemaName: { type: 'string' },
          status: {
            type: 'string',
            enum: tenantStatusValues,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      TenantDirectoryListFilter: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            minLength: 1,
            maxLength: 120,
          },
          status: {
            type: 'string',
            enum: tenantStatusValues,
          },
        },
      },
      TenantDirectoryListRequest: {
        type: 'object',
        required: ['filters'],
        properties: {
          filters: { $ref: '#/components/schemas/TenantDirectoryListFilter' },
        },
      },
      TenantDirectoryListFilters: {
        type: 'object',
        required: ['name', 'status'],
        properties: {
          name: { type: 'string', nullable: true },
          status: {
            type: 'string',
            nullable: true,
            enum: tenantStatusValues,
          },
        },
      },
      TenantDirectoryListMeta: {
        type: 'object',
        required: ['totalRecords', 'filters'],
        properties: {
          totalRecords: {
            type: 'integer',
            minimum: 0,
          },
          filters: { $ref: '#/components/schemas/TenantDirectoryListFilters' },
        },
      },
      TenantDirectoryListData: {
        type: 'object',
        required: ['tenantList'],
        properties: {
          tenantList: {
            type: 'array',
            items: { $ref: '#/components/schemas/TenantDirectoryListItem' },
          },
        },
      },
      TenantDirectoryListResponse: {
        type: 'object',
        required: ['data', 'meta'],
        properties: {
          data: { $ref: '#/components/schemas/TenantDirectoryListData' },
          meta: { $ref: '#/components/schemas/TenantDirectoryListMeta' },
        },
      },
      TenantCreateRoleOption: {
        type: 'object',
        required: ['roleCode', 'displayName', 'description', 'isDefault', 'isRequired'],
        properties: {
          roleCode: { type: 'string', enum: roleCodeValues },
          displayName: { type: 'string' },
          description: { type: 'string', nullable: true },
          isDefault: { type: 'boolean' },
          isRequired: { type: 'boolean' },
        },
      },
      TenantCreateManagementSystemType: {
        type: 'object',
        required: ['typeCode', 'version', 'displayName', 'description', 'roleOptions'],
        properties: {
          typeCode: { type: 'string', enum: managementSystemTypeCodeValues },
          version: { type: 'string' },
          displayName: { type: 'string' },
          description: { type: 'string', nullable: true },
          roleOptions: {
            type: 'array',
            items: { $ref: '#/components/schemas/TenantCreateRoleOption' },
          },
        },
      },
      TenantCreateReferenceDataFilter: {
        type: 'object',
        properties: {
          typeCode: { type: 'string', enum: managementSystemTypeCodeValues },
        },
      },
      TenantCreateReferenceDataRequest: {
        type: 'object',
        required: ['filter'],
        properties: {
          filter: { $ref: '#/components/schemas/TenantCreateReferenceDataFilter' },
        },
      },
      TenantCreateReferenceDataData: {
        type: 'object',
        required: ['managementSystemTypeList'],
        properties: {
          managementSystemTypeList: {
            type: 'array',
            items: { $ref: '#/components/schemas/TenantCreateManagementSystemType' },
          },
        },
      },
      TenantCreateReferenceDataResponse: {
        type: 'object',
        required: ['data'],
        properties: {
          data: { $ref: '#/components/schemas/TenantCreateReferenceDataData' },
        },
      },
      DeprovisionType: {
        type: 'string',
        enum: deprovisionTypeValues,
        default: DeprovisionTypeEnum.SOFT,
      },
      DeprovisionTenantRequest: {
        type: 'object',
        required: ['tenantId'],
        properties: {
          tenantId: { type: 'string' },
          deprovisionType: { $ref: '#/components/schemas/DeprovisionType' },
        },
      },
      SoftDeprovisionTenantResponse: {
        type: 'object',
        required: ['tenantId', 'slug', 'schemaName', 'previousStatus', 'status', 'operation'],
        properties: {
          tenantId: { type: 'string' },
          slug: { type: 'string' },
          schemaName: { type: 'string' },
          previousStatus: {
            type: 'string',
            enum: tenantStatusValues,
          },
          status: {
            type: 'string',
            enum: ['inactive'],
          },
          operation: {
            type: 'string',
            enum: ['soft_deprovisioned'],
          },
        },
      },
      HardDeprovisionTenantResponse: {
        type: 'object',
        required: ['tenantId', 'slug', 'schemaName', 'previousStatus', 'status', 'operation'],
        properties: {
          tenantId: { type: 'string' },
          slug: { type: 'string' },
          schemaName: { type: 'string' },
          previousStatus: {
            type: 'string',
            enum: tenantStatusValues,
          },
          status: {
            type: 'string',
            enum: ['hard_deprovisioned'],
          },
          operation: {
            type: 'string',
            enum: ['hard_deprovisioned'],
          },
        },
      },
      TenantStatusCountEntry: {
        type: 'object',
        required: ['status', 'count'],
        properties: {
          status: {
            type: 'string',
            enum: tenantStatusValues,
          },
          count: {
            type: 'integer',
            minimum: 0,
          },
        },
      },
      DashboardMetricWindow: {
        type: 'string',
        enum: dashboardMetricWindowValues,
      },
      NewTenantCountMetric: {
        type: 'object',
        required: ['window', 'count'],
        properties: {
          window: {
            $ref: '#/components/schemas/DashboardMetricWindow',
          },
          count: {
            type: 'integer',
            minimum: 0,
            description:
              'Count of tenants created inside the current trailing window ending at request time.',
          },
        },
      },
      TenantGrowthRateMetric: {
        type: 'object',
        required: ['window', 'growthRatePercentage'],
        properties: {
          window: {
            $ref: '#/components/schemas/DashboardMetricWindow',
          },
          growthRatePercentage: {
            type: 'number',
            description:
              'Percentage change between the current trailing window and the immediately preceding equal-length window, rounded to two decimals.',
          },
        },
      },
      TenantSummaryWidget: {
        type: 'object',
        required: [
          'totalTenantCount',
          'tenantUserCount',
          'tenantStatusCounts',
          'newTenantCounts',
          'tenantGrowthRates',
        ],
        properties: {
          totalTenantCount: {
            type: 'integer',
            minimum: 0,
          },
          tenantUserCount: {
            type: 'integer',
            minimum: 0,
          },
          tenantStatusCounts: {
            type: 'array',
            items: { $ref: '#/components/schemas/TenantStatusCountEntry' },
          },
          newTenantCounts: {
            type: 'array',
            description:
              'Ordered `week`, `month`, and `year` trailing-window tenant creation counts.',
            items: { $ref: '#/components/schemas/NewTenantCountMetric' },
          },
          tenantGrowthRates: {
            type: 'array',
            description:
              'Ordered `week`, `month`, and `year` percentage changes comparing the current trailing window to the immediately preceding equal-length window.',
            items: { $ref: '#/components/schemas/TenantGrowthRateMetric' },
          },
        },
      },
      DashboardOverviewResponse: {
        type: 'object',
        required: ['widgets'],
        properties: {
          widgets: {
            type: 'object',
            required: ['tenantSummary'],
            properties: {
              tenantSummary: { $ref: '#/components/schemas/TenantSummaryWidget' },
            },
          },
        },
      },
      // ── Platform Users & Tenant Members schemas ──────────────────────────
      RoleAuthClass: {
        type: 'string',
        enum: roleAuthClassValues,
      },
      RoleScope: {
        type: 'string',
        enum: roleScopeValues,
      },
      RoleAssignmentStatus: {
        type: 'string',
        enum: roleAssignmentStatusValues,
      },
      TenantMembershipStatus: {
        type: 'string',
        enum: tenantMembershipStatusValues,
      },
      PlatformUserAccountStatusEnum: {
        type: 'string',
        enum: platformUserAccountStatusEnumValues,
      },
      PlatformUserListItem: {
        type: 'object',
        required: [
          'userId',
          'email',
          'username',
          'displayName',
          'accountStatus',
          'platformRoles',
          'tenantMembershipCount',
          'createdAt',
        ],
        properties: {
          userId: { type: 'string' },
          email: { type: 'string', format: 'email' },
          username: { type: 'string', nullable: true },
          displayName: { type: 'string' },
          accountStatus: { $ref: '#/components/schemas/PlatformUserAccountStatusEnum' },
          platformRoles: { type: 'array', items: { type: 'string' } },
          tenantMembershipCount: { type: 'integer', minimum: 0 },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      PlatformUserSearchFilter: {
        type: 'object',
        properties: {
          search: { type: 'string', minLength: 1, maxLength: 200 },
          accountStatus: { $ref: '#/components/schemas/PlatformUserAccountStatusEnum' },
        },
      },
      PlatformUserSearchRequest: {
        type: 'object',
        properties: {
          filters: { $ref: '#/components/schemas/PlatformUserSearchFilter' },
          page: { type: 'integer', minimum: 1, default: 1 },
          pageSize: { type: 'integer', minimum: 1, maximum: 100, default: 25 },
        },
      },
      PlatformUserSearchData: {
        type: 'object',
        required: ['userList'],
        properties: {
          userList: {
            type: 'array',
            items: { $ref: '#/components/schemas/PlatformUserListItem' },
          },
        },
      },
      PlatformUserSearchFilters: {
        type: 'object',
        required: ['search', 'accountStatus'],
        properties: {
          search: { type: 'string', nullable: true },
          accountStatus: {
            type: 'string',
            nullable: true,
            enum: platformUserAccountStatusEnumValues,
          },
        },
      },
      PlatformUserSearchMeta: {
        type: 'object',
        required: ['totalRecords', 'page', 'pageSize', 'filters'],
        properties: {
          totalRecords: { type: 'integer', minimum: 0 },
          page: { type: 'integer', minimum: 1 },
          pageSize: { type: 'integer', minimum: 1 },
          filters: { $ref: '#/components/schemas/PlatformUserSearchFilters' },
        },
      },
      PlatformUserSearchResponse: {
        type: 'object',
        required: ['data', 'meta'],
        properties: {
          data: { $ref: '#/components/schemas/PlatformUserSearchData' },
          meta: { $ref: '#/components/schemas/PlatformUserSearchMeta' },
        },
      },
      PlatformRoleAssignment: {
        type: 'object',
        required: [
          'assignmentId',
          'roleCode',
          'displayName',
          'authClass',
          'assignmentStatus',
          'assignedAt',
        ],
        properties: {
          assignmentId: { type: 'string' },
          roleCode: { type: 'string' },
          displayName: { type: 'string' },
          authClass: { $ref: '#/components/schemas/RoleAuthClass' },
          assignmentStatus: { $ref: '#/components/schemas/RoleAssignmentStatus' },
          assignedAt: { type: 'string', format: 'date-time' },
        },
      },
      TenantMembershipRoleAssignmentSummary: {
        type: 'object',
        required: [
          'assignmentId',
          'roleCode',
          'displayName',
          'authClass',
          'assignmentStatus',
          'isPrimary',
          'assignedAt',
        ],
        properties: {
          assignmentId: { type: 'string' },
          roleCode: { type: 'string' },
          displayName: { type: 'string' },
          authClass: { $ref: '#/components/schemas/RoleAuthClass' },
          assignmentStatus: { $ref: '#/components/schemas/RoleAssignmentStatus' },
          isPrimary: { type: 'boolean' },
          assignedAt: { type: 'string', format: 'date-time' },
        },
      },
      TenantMembershipSummary: {
        type: 'object',
        required: [
          'membershipId',
          'tenantId',
          'tenantName',
          'tenantSlug',
          'membershipStatus',
          'joinedAt',
          'roleAssignments',
        ],
        properties: {
          membershipId: { type: 'string' },
          tenantId: { type: 'string' },
          tenantName: { type: 'string' },
          tenantSlug: { type: 'string' },
          membershipStatus: { $ref: '#/components/schemas/TenantMembershipStatus' },
          joinedAt: { type: 'string', format: 'date-time' },
          roleAssignments: {
            type: 'array',
            items: { $ref: '#/components/schemas/TenantMembershipRoleAssignmentSummary' },
          },
        },
      },
      PlatformUserDetail: {
        type: 'object',
        required: [
          'userId',
          'email',
          'username',
          'displayName',
          'accountStatus',
          'createdAt',
          'updatedAt',
          'platformRoleAssignments',
          'tenantMemberships',
        ],
        properties: {
          userId: { type: 'string' },
          email: { type: 'string', format: 'email' },
          username: { type: 'string', nullable: true },
          displayName: { type: 'string' },
          accountStatus: { $ref: '#/components/schemas/PlatformUserAccountStatusEnum' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          platformRoleAssignments: {
            type: 'array',
            items: { $ref: '#/components/schemas/PlatformRoleAssignment' },
          },
          tenantMemberships: {
            type: 'array',
            items: { $ref: '#/components/schemas/TenantMembershipSummary' },
          },
        },
      },
      PlatformUserDetailRequest: {
        type: 'object',
        required: ['userId'],
        properties: {
          userId: { type: 'string', minLength: 1 },
        },
        additionalProperties: false,
      },
      PlatformUserDetailResponse: {
        type: 'object',
        required: ['data'],
        properties: {
          data: { $ref: '#/components/schemas/PlatformUserDetail' },
        },
      },
      CreateTenantMembershipRequest: {
        type: 'object',
        required: ['userId', 'tenantId', 'roleCode'],
        properties: {
          userId: { type: 'string', minLength: 1 },
          tenantId: { type: 'string', minLength: 1 },
          roleCode: { type: 'string', enum: roleCodeValues },
        },
      },
      CreateTenantMembershipData: {
        type: 'object',
        required: [
          'membershipId',
          'userId',
          'tenantId',
          'roleCode',
          'membershipStatus',
          'assignmentStatus',
          'isPrimary',
        ],
        properties: {
          membershipId: { type: 'string' },
          userId: { type: 'string' },
          tenantId: { type: 'string' },
          roleCode: { type: 'string' },
          membershipStatus: { $ref: '#/components/schemas/TenantMembershipStatus' },
          assignmentStatus: { $ref: '#/components/schemas/RoleAssignmentStatus' },
          isPrimary: { type: 'boolean' },
        },
      },
      CreateTenantMembershipResponse: {
        type: 'object',
        required: ['data'],
        properties: {
          data: { $ref: '#/components/schemas/CreateTenantMembershipData' },
        },
      },
      TenantMemberListItem: {
        type: 'object',
        required: [
          'membershipId',
          'userId',
          'email',
          'username',
          'displayName',
          'accountStatus',
          'membershipStatus',
          'joinedAt',
          'roleAssignments',
        ],
        properties: {
          membershipId: { type: 'string' },
          userId: { type: 'string' },
          email: { type: 'string', format: 'email' },
          username: { type: 'string', nullable: true },
          displayName: { type: 'string' },
          accountStatus: { $ref: '#/components/schemas/PlatformUserAccountStatusEnum' },
          membershipStatus: { $ref: '#/components/schemas/TenantMembershipStatus' },
          joinedAt: { type: 'string', format: 'date-time' },
          roleAssignments: {
            type: 'array',
            items: { $ref: '#/components/schemas/TenantMembershipRoleAssignmentSummary' },
          },
        },
      },
      TenantMemberSearchFilter: {
        type: 'object',
        properties: {
          search: { type: 'string', minLength: 1, maxLength: 200 },
          roleCode: { type: 'string', enum: roleCodeValues },
        },
      },
      TenantMemberSearchRequest: {
        type: 'object',
        properties: {
          filters: { $ref: '#/components/schemas/TenantMemberSearchFilter' },
          page: { type: 'integer', minimum: 1, default: 1 },
          pageSize: { type: 'integer', minimum: 1, maximum: 100, default: 25 },
        },
      },
      TenantMemberSearchData: {
        type: 'object',
        required: ['memberList'],
        properties: {
          memberList: {
            type: 'array',
            items: { $ref: '#/components/schemas/TenantMemberListItem' },
          },
        },
      },
      TenantMemberSearchFilters: {
        type: 'object',
        required: ['search', 'roleCode'],
        properties: {
          search: { type: 'string', nullable: true },
          roleCode: { type: 'string', nullable: true },
        },
      },
      TenantMemberSearchMeta: {
        type: 'object',
        required: ['totalRecords', 'page', 'pageSize', 'filters'],
        properties: {
          totalRecords: { type: 'integer', minimum: 0 },
          page: { type: 'integer', minimum: 1 },
          pageSize: { type: 'integer', minimum: 1 },
          filters: { $ref: '#/components/schemas/TenantMemberSearchFilters' },
        },
      },
      TenantMemberSearchResponse: {
        type: 'object',
        required: ['data', 'meta'],
        properties: {
          data: { $ref: '#/components/schemas/TenantMemberSearchData' },
          meta: { $ref: '#/components/schemas/TenantMemberSearchMeta' },
        },
      },
      AssignTenantMemberRoleRequest: {
        type: 'object',
        required: ['membershipId', 'roleCode'],
        properties: {
          membershipId: { type: 'string', minLength: 1 },
          roleCode: { type: 'string', enum: roleCodeValues },
        },
      },
      AssignTenantMemberRoleData: {
        type: 'object',
        required: [
          'assignmentId',
          'membershipId',
          'roleCode',
          'displayName',
          'assignmentStatus',
          'isPrimary',
          'assignedAt',
        ],
        properties: {
          assignmentId: { type: 'string' },
          membershipId: { type: 'string' },
          roleCode: { type: 'string' },
          displayName: { type: 'string' },
          assignmentStatus: { $ref: '#/components/schemas/RoleAssignmentStatus' },
          isPrimary: { type: 'boolean' },
          assignedAt: { type: 'string', format: 'date-time' },
        },
      },
      AssignTenantMemberRoleResponse: {
        type: 'object',
        required: ['data'],
        properties: {
          data: { $ref: '#/components/schemas/AssignTenantMemberRoleData' },
        },
      },
      RevokeTenantMemberRoleRequest: {
        type: 'object',
        required: ['membershipId', 'roleCode'],
        properties: {
          membershipId: { type: 'string', minLength: 1 },
          roleCode: { type: 'string', enum: roleCodeValues },
        },
      },
      RevokeTenantMemberRoleData: {
        type: 'object',
        required: ['assignmentId', 'membershipId', 'roleCode', 'assignmentStatus', 'endedAt'],
        properties: {
          assignmentId: { type: 'string' },
          membershipId: { type: 'string' },
          roleCode: { type: 'string' },
          assignmentStatus: { $ref: '#/components/schemas/RoleAssignmentStatus' },
          endedAt: { type: 'string', format: 'date-time' },
        },
      },
      RevokeTenantMemberRoleResponse: {
        type: 'object',
        required: ['data'],
        properties: {
          data: { $ref: '#/components/schemas/RevokeTenantMemberRoleData' },
        },
      },
      TenantRoleItem: {
        type: 'object',
        required: ['roleCode', 'displayName', 'description', 'authClass', 'scope'],
        properties: {
          roleCode: { type: 'string' },
          displayName: { type: 'string' },
          description: { type: 'string', nullable: true },
          authClass: { $ref: '#/components/schemas/RoleAuthClass' },
          scope: { $ref: '#/components/schemas/RoleScope' },
        },
      },
      TenantRoleListResponse: {
        type: 'object',
        required: ['data'],
        properties: {
          data: {
            type: 'object',
            required: ['roles'],
            properties: {
              roles: {
                type: 'array',
                items: { $ref: '#/components/schemas/TenantRoleItem' },
              },
            },
          },
        },
      },
    },
  },
  paths: {
    '/api/v1/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Authenticate with username or email',
        description:
          'Returns a signed JWT access token, decoded claims, and the current-user context.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' },
              examples: {
                username: {
                  value: {
                    identifier: 'super.admin',
                    password: 'SeedSuperAdmin123!',
                  },
                },
                email: {
                  value: {
                    identifier: 'super-admin@acme-local.test',
                    password: 'SeedSuperAdmin123!',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Authenticated response',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AccessTokenResponse' },
              },
            },
          },
          '400': errorResponse(
            'Invalid login payload',
            'validation_error',
            'Invalid login payload',
          ),
          '401': errorResponse('Invalid credentials', 'invalid_credentials', 'Invalid credentials'),
          '403': {
            description: 'Account disabled or routing unavailable',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                examples: {
                  disabledAccount: {
                    value: {
                      errorCode: 'disabled_account',
                      message: 'Account is disabled',
                    },
                  },
                  tenantMembershipRequired: {
                    value: {
                      errorCode: 'tenant_membership_required',
                      message: 'An active tenant membership is required for this user',
                      routing: {
                        status: 'access_denied',
                        targetApp: null,
                        reasonCode: 'missing_active_tenant_membership',
                      },
                    },
                  },
                  tenantSelectionRequired: {
                    value: {
                      errorCode: 'tenant_selection_required',
                      message: 'Tenant selection is required and is not yet supported',
                      routing: {
                        status: 'selection_required',
                        targetApp: null,
                        reasonCode: 'multiple_active_tenant_memberships',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Resolve the current authenticated user',
        description:
          'Returns principal, role context, tenant context when applicable, and the target app. Authenticated tenant users without a single active tenant membership receive a structured routing 403 response.',
        security: bearerSecurity,
        responses: {
          '200': {
            description: 'Current-user response',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CurrentUserResponse' },
              },
            },
          },
          '401': errorResponse(
            'Missing or invalid bearer token',
            'unauthenticated',
            'Missing bearer token',
          ),
          '403': {
            description: 'Authenticated user cannot be routed into a supported app target',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                examples: {
                  tenantMembershipRequired: {
                    value: {
                      errorCode: 'tenant_membership_required',
                      message: 'An active tenant membership is required for this user',
                      routing: {
                        status: 'access_denied',
                        targetApp: null,
                        reasonCode: 'missing_active_tenant_membership',
                      },
                    },
                  },
                  tenantSelectionRequired: {
                    value: {
                      errorCode: 'tenant_selection_required',
                      message: 'Tenant selection is required and is not yet supported',
                      routing: {
                        status: 'selection_required',
                        targetApp: null,
                        reasonCode: 'multiple_active_tenant_memberships',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Logout the current client session',
        description: 'Stateless logout. Clients should discard the stored token locally.',
        requestBody: {
          required: false,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                additionalProperties: false,
              },
              examples: {
                empty: {
                  value: {},
                },
              },
            },
          },
        },
        responses: {
          '204': {
            description: 'Logout accepted with no response body',
          },
          '400': errorResponse(
            'Invalid logout payload',
            'validation_error',
            'Invalid logout payload',
          ),
        },
      },
    },
    '/api/v1/platform/ping': {
      get: {
        tags: ['Authorization'],
        summary: 'Check platform-only access',
        description: 'Protected example route for the platform namespace.',
        security: bearerSecurity,
        responses: {
          '200': {
            description: 'Platform access allowed',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['ok', 'namespace'],
                  properties: {
                    ok: { type: 'boolean' },
                    namespace: { type: 'string', enum: ['platform'] },
                  },
                },
              },
            },
          },
          '401': errorResponse(
            'Unauthenticated request',
            'unauthenticated',
            'Missing bearer token',
          ),
          '403': errorResponse('Role not allowed', 'forbidden_role', 'Insufficient role'),
        },
      },
    },
    '/api/v1/platform/dashboard/overview': {
      get: {
        tags: ['Platform Dashboard'],
        summary: 'Get super-admin dashboard overview widgets',
        description:
          'Protected super-admin route that returns dashboard summary metrics, including tenant totals, tenant-status counts, trailing new-tenant windows, and trailing growth-rate windows.',
        security: bearerSecurity,
        responses: {
          '200': {
            description: 'Dashboard overview widgets',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/DashboardOverviewResponse' },
              },
            },
          },
          '401': errorResponse(
            'Unauthenticated request',
            'unauthenticated',
            'Missing bearer token',
          ),
          '403': errorResponse('Role not allowed', 'forbidden_role', 'Insufficient role'),
        },
      },
    },
    '/api/v1/platform/tenants/search': {
      post: {
        tags: ['Platform Tenants'],
        summary: 'Search tenants for the control plane',
        description:
          'Protected super-admin route that returns the tenant directory in the agreed `data` plus `meta` envelope. Accepts a request body with `filters.name` and `filters.status`.',
        security: bearerSecurity,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TenantDirectoryListRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Tenant directory response',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TenantDirectoryListResponse' },
              },
            },
          },
          '400': errorResponse(
            'Invalid tenant directory filter',
            'validation_error',
            'Invalid tenant directory filter',
          ),
          '429': errorResponse(
            'Rate limited request',
            'rate_limited',
            'Too many tenant directory requests',
          ),
          '401': errorResponse(
            'Unauthenticated request',
            'unauthenticated',
            'Missing bearer token',
          ),
          '403': errorResponse('Role not allowed', 'forbidden_role', 'Insufficient role'),
        },
      },
    },
    '/api/v1/platform/tenant/reference-data': {
      post: {
        tags: ['Platform Tenants'],
        summary: 'Get tenant-create reference data',
        description:
          'Protected super-admin route that returns supported management-system types and their role options for the tenant-create flow. Accepts an optional request body filter for a single management-system type.',
        security: bearerSecurity,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TenantCreateReferenceDataRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Tenant-create reference data response',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TenantCreateReferenceDataResponse' },
              },
            },
          },
          '400': errorResponse(
            'Invalid tenant create reference-data filter',
            'validation_error',
            'Invalid tenant create reference-data filter',
          ),
          '429': errorResponse(
            'Rate limited request',
            'rate_limited',
            'Too many tenant directory requests',
          ),
          '401': errorResponse(
            'Unauthenticated request',
            'unauthenticated',
            'Missing bearer token',
          ),
          '403': errorResponse('Role not allowed', 'forbidden_role', 'Insufficient role'),
        },
      },
    },
    '/api/v1/tenant/access': {
      post: {
        tags: ['Authorization'],
        summary: 'Check tenant access',
        description:
          'Protected route for tenant access checks scoped by auth class and tenant identifier.',
        security: bearerSecurity,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TenantAccessRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Tenant access allowed',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['ok', 'namespace'],
                  properties: {
                    ok: { type: 'boolean' },
                    namespace: { type: 'string', enum: ['tenant-admin', 'tenant-user'] },
                  },
                },
              },
            },
          },
          '400': errorResponse(
            'Invalid tenant access payload',
            'validation_error',
            'Invalid tenant access payload',
          ),
          '401': errorResponse(
            'Unauthenticated request',
            'unauthenticated',
            'Missing bearer token',
          ),
          '403': errorResponse('Tenant or role not allowed', 'forbidden_role', 'Insufficient role'),
        },
      },
    },
    '/api/v1/platform/tenant': {
      post: {
        tags: ['Platform Tenants'],
        summary: 'Provision a tenant',
        description: 'Protected super-admin route used to create and provision a tenant.',
        security: bearerSecurity,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TenantProvisionRequest' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Tenant provisioned',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TenantProvisionResponse' },
              },
            },
          },
          '400': errorResponse(
            'Invalid tenant provisioning payload',
            'validation_error',
            'Invalid tenant provisioning payload',
          ),
          '401': errorResponse(
            'Unauthenticated request',
            'unauthenticated',
            'Missing bearer token',
          ),
          '403': errorResponse('Role not allowed', 'forbidden_role', 'Insufficient role'),
          '429': errorResponse('Rate limited', 'rate_limited', 'Too many tenant mutation requests'),
          '409': errorResponse('Tenant slug conflict', 'conflict', 'tenant slug already exists'),
        },
      },
    },
    '/api/v1/platform/tenant/deprovision': {
      post: {
        tags: ['Platform Tenants'],
        summary: 'Soft or hard deprovision a tenant',
        description:
          'Protected super-admin route used to soft deprovision a tenant by default or hard deprovision it when `deprovisionType` is `hard`. Hard deprovision drops the tenant schema and tenant-scoped metadata but retains the tenant record in `hard_deprovisioned`.',
        security: bearerSecurity,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/DeprovisionTenantRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Tenant deprovisioned',
            content: {
              'application/json': {
                schema: {
                  oneOf: [
                    { $ref: '#/components/schemas/SoftDeprovisionTenantResponse' },
                    { $ref: '#/components/schemas/HardDeprovisionTenantResponse' },
                  ],
                },
              },
            },
          },
          '400': errorResponse(
            'Invalid tenant deprovision payload',
            'validation_error',
            'Invalid tenant deprovision payload',
          ),
          '401': errorResponse(
            'Unauthenticated request',
            'unauthenticated',
            'Missing bearer token',
          ),
          '403': errorResponse('Role not allowed', 'forbidden_role', 'Insufficient role'),
          '429': errorResponse('Rate limited', 'rate_limited', 'Too many tenant mutation requests'),
          '404': errorResponse('Tenant not found', 'not_found', 'Tenant was not found'),
          '409': errorResponse(
            'Tenant deprovision conflict',
            'conflict',
            'Tenant deprovision request conflicts with current tenant state',
          ),
        },
      },
    },
    // ── Platform Users endpoints ─────────────────────────────────────────
    '/api/v1/platform/users/search': {
      post: {
        tags: ['Platform Users'],
        summary: 'Search platform users',
        description:
          'Protected super-admin route that returns the platform user directory with pagination. Accepts optional filters for search text and account status.',
        security: bearerSecurity,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PlatformUserSearchRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Platform user directory response',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PlatformUserSearchResponse' },
              },
            },
          },
          '400': errorResponse(
            'Invalid user search payload',
            'validation_error',
            'Invalid user search payload',
          ),
          '401': errorResponse(
            'Unauthenticated request',
            'unauthenticated',
            'Missing bearer token',
          ),
          '403': errorResponse('Role not allowed', 'forbidden_role', 'Insufficient role'),
          '429': errorResponse(
            'Rate limited request',
            'rate_limited',
            'Too many user directory requests',
          ),
        },
      },
    },
    '/api/v1/platform/user': {
      post: {
        tags: ['Platform Users'],
        summary: 'Get platform user detail',
        description:
          'Protected super-admin route that returns a single user profile with all platform role assignments and tenant memberships. The user identifier is provided in the request body.',
        security: bearerSecurity,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PlatformUserDetailRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Platform user detail response',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PlatformUserDetailResponse' },
              },
            },
          },
          '400': errorResponse(
            'Invalid user detail payload',
            'validation_error',
            'Invalid user detail payload',
          ),
          '401': errorResponse(
            'Unauthenticated request',
            'unauthenticated',
            'Missing bearer token',
          ),
          '403': errorResponse('Role not allowed', 'forbidden_role', 'Insufficient role'),
          '404': errorResponse('User not found', 'not_found', 'User not found'),
          '429': errorResponse(
            'Rate limited request',
            'rate_limited',
            'Too many user directory requests',
          ),
        },
      },
    },
    '/api/v1/platform/tenant/membership': {
      post: {
        tags: ['Platform Users'],
        summary: 'Create a tenant membership',
        description:
          'Protected super-admin route that creates a new tenant membership for a user with an initial role assignment. Validates user, tenant, and role existence before creation.',
        security: bearerSecurity,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateTenantMembershipRequest' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Tenant membership created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreateTenantMembershipResponse' },
              },
            },
          },
          '400': errorResponse(
            'Invalid tenant membership payload',
            'validation_error',
            'Invalid tenant membership payload',
          ),
          '401': errorResponse(
            'Unauthenticated request',
            'unauthenticated',
            'Missing bearer token',
          ),
          '403': errorResponse('Role not allowed', 'forbidden_role', 'Insufficient role'),
          '404': errorResponse('User, tenant, or role not found', 'not_found', 'User not found'),
          '409': errorResponse(
            'Membership already exists',
            'conflict',
            'User already has an active membership for this tenant',
          ),
          '429': errorResponse(
            'Rate limited request',
            'rate_limited',
            'Too many user management requests',
          ),
        },
      },
    },
    // ── Tenant Members endpoints ─────────────────────────────────────────
    '/api/v1/tenant/members/search': {
      post: {
        tags: ['Tenant Members'],
        summary: 'Search tenant members',
        description:
          'Protected tenant-admin route that returns tenant members with pagination. Scoped to the authenticated tenant context. Accepts optional filters for search text and role code.',
        security: bearerSecurity,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TenantMemberSearchRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Tenant member directory response',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TenantMemberSearchResponse' },
              },
            },
          },
          '400': errorResponse(
            'Invalid member search payload',
            'validation_error',
            'Invalid member search payload',
          ),
          '401': errorResponse(
            'Unauthenticated request',
            'unauthenticated',
            'Missing bearer token',
          ),
          '403': errorResponse(
            'No tenant context or insufficient role',
            'forbidden_tenant',
            'No tenant context available',
          ),
          '429': errorResponse(
            'Rate limited request',
            'rate_limited',
            'Too many tenant member requests',
          ),
        },
      },
    },
    '/api/v1/tenant/members/roles': {
      post: {
        tags: ['Tenant Members'],
        summary: 'Assign a role to a tenant member',
        description:
          'Protected tenant-admin route that assigns a role to a tenant member. Re-activates an existing inactive assignment for the same role instead of creating a duplicate.',
        security: bearerSecurity,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AssignTenantMemberRoleRequest' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Role assigned to tenant member',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AssignTenantMemberRoleResponse' },
              },
            },
          },
          '400': errorResponse(
            'Invalid role assignment payload',
            'validation_error',
            'Invalid role assignment payload',
          ),
          '401': errorResponse(
            'Unauthenticated request',
            'unauthenticated',
            'Missing bearer token',
          ),
          '403': errorResponse(
            'No tenant context or insufficient role',
            'forbidden_tenant',
            'No tenant context available',
          ),
          '404': errorResponse(
            'Membership or role not found',
            'not_found',
            'Tenant membership not found',
          ),
          '409': errorResponse(
            'Role already assigned',
            'conflict',
            'Member already has an active assignment for this role',
          ),
          '429': errorResponse(
            'Rate limited request',
            'rate_limited',
            'Too many tenant member management requests',
          ),
        },
      },
    },
    '/api/v1/tenant/members/roles/revoke': {
      post: {
        tags: ['Tenant Members'],
        summary: 'Revoke a role from a tenant member',
        description:
          'Protected tenant-admin route that revokes a role from a tenant member. Prevents revoking the last active role assignment to maintain at least one active role per member.',
        security: bearerSecurity,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RevokeTenantMemberRoleRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Role revoked from tenant member',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RevokeTenantMemberRoleResponse' },
              },
            },
          },
          '400': errorResponse(
            'Invalid role revocation payload or last role guard',
            'validation_error',
            'Invalid role revocation payload',
          ),
          '401': errorResponse(
            'Unauthenticated request',
            'unauthenticated',
            'Missing bearer token',
          ),
          '403': errorResponse(
            'No tenant context or insufficient role',
            'forbidden_tenant',
            'No tenant context available',
          ),
          '404': errorResponse(
            'Membership or role assignment not found',
            'not_found',
            'Tenant membership not found',
          ),
          '429': errorResponse(
            'Rate limited request',
            'rate_limited',
            'Too many tenant member management requests',
          ),
        },
      },
    },
    '/api/v1/tenant/roles': {
      get: {
        tags: ['Tenant Members'],
        summary: 'List tenant role catalog',
        description:
          'Protected tenant-admin route that returns all roles with scope "tenant". Used to populate role selection dropdowns.',
        security: bearerSecurity,
        responses: {
          '200': {
            description: 'Tenant role catalog response',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TenantRoleListResponse' },
              },
            },
          },
          '401': errorResponse(
            'Unauthenticated request',
            'unauthenticated',
            'Missing bearer token',
          ),
          '403': errorResponse(
            'No tenant context or insufficient role',
            'forbidden_tenant',
            'No tenant context available',
          ),
          '429': errorResponse(
            'Rate limited request',
            'rate_limited',
            'Too many tenant member requests',
          ),
        },
      },
    },
  },
};
