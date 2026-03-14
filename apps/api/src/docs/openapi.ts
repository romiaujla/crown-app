import { DashboardMetricWindowEnum, DeprovisionTypeEnum, TenantStatusEnum } from "@crown/types";
import { AuthErrorCodeEnum, RoleEnum, TenantRoleEnum } from "../auth/claims.js";
import { AuthRoutingReasonCodeEnum, AuthRoutingStatusEnum, AuthTargetAppEnum } from "../auth/service.js";
import { PlatformUserAccountStatus } from "../domain/status-enums.js";

const bearerSecurity = [{ bearerAuth: [] }];
const authErrorCodeValues = Object.values(AuthErrorCodeEnum);
const roleValues = Object.values(RoleEnum);
const tenantRoleValues = Object.values(TenantRoleEnum);
const authRoutingStatusValues = Object.values(AuthRoutingStatusEnum);
const authRoutingReasonCodeValues = Object.values(AuthRoutingReasonCodeEnum);
const authTargetAppValues = Object.values(AuthTargetAppEnum);
const platformUserAccountStatusValues = Object.values(PlatformUserAccountStatus);
const tenantStatusValues = Object.values(TenantStatusEnum);
const deprovisionTypeValues = Object.values(DeprovisionTypeEnum);
const dashboardMetricWindowValues = Object.values(DashboardMetricWindowEnum);

const errorResponse = (description: string, errorCode: string, message: string) => ({
  description,
  content: {
    "application/json": {
      schema: { $ref: "#/components/schemas/ErrorResponse" },
      examples: {
        default: {
          value: {
            error_code: errorCode,
            message
          }
        }
      }
    }
  }
});

export const authDocsDocument = {
  openapi: "3.0.3",
  info: {
    title: "Crown API Docs",
    version: "0.1.0",
    description: "Local/dev-first Swagger UI for the auth-bearing API surface."
  },
  servers: [{ url: "/" }],
  tags: [
    { name: "Auth", description: "Authentication and current-user endpoints." },
    { name: "Authorization", description: "Protected route examples for platform and tenant access." },
    { name: "Platform Dashboard", description: "Super-admin dashboard overview widgets and summary data." },
    { name: "Platform Tenants", description: "Tenant provisioning route protected for super admins." }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },
    schemas: {
      Role: {
        type: "string",
        enum: roleValues
      },
      PlatformUserAccountStatus: {
        type: "string",
        enum: platformUserAccountStatusValues
      },
      JwtClaims: {
        type: "object",
        required: ["sub", "role", "tenant_id", "exp"],
        properties: {
          sub: { type: "string" },
          role: { $ref: "#/components/schemas/Role" },
          tenant_id: { type: "string", nullable: true },
          exp: {
            type: "integer",
            format: "int64",
            description: "Unix timestamp in seconds when the access token expires."
          }
        }
      },
      LoginRequest: {
        type: "object",
        required: ["identifier", "password"],
        properties: {
          identifier: {
            type: "string",
            minLength: 3,
            description: "Username or email address."
          },
          password: {
            type: "string",
            minLength: 8
          }
        }
      },
      ErrorResponse: {
        type: "object",
        required: ["error_code", "message"],
        properties: {
          error_code: {
            type: "string",
            enum: authErrorCodeValues
          },
          message: { type: "string" },
          routing: { $ref: "#/components/schemas/AuthRouting" }
        }
      },
      AuthRouting: {
        type: "object",
        required: ["status", "target_app", "reason_code"],
        properties: {
          status: {
            type: "string",
            enum: authRoutingStatusValues
          },
          target_app: {
            type: "string",
            nullable: true,
            enum: authTargetAppValues
          },
          reason_code: {
            type: "string",
            nullable: true,
            enum: authRoutingReasonCodeValues
          }
        }
      },
      CurrentUserPrincipal: {
        type: "object",
        required: ["id", "email", "username", "display_name", "role", "account_status"],
        properties: {
          id: { type: "string" },
          email: { type: "string", format: "email" },
          username: { type: "string", nullable: true },
          display_name: { type: "string" },
          role: { $ref: "#/components/schemas/Role" },
          account_status: { $ref: "#/components/schemas/PlatformUserAccountStatus" }
        }
      },
      CurrentUserRoleContext: {
        type: "object",
        required: ["role", "tenant_id"],
        properties: {
          role: { $ref: "#/components/schemas/Role" },
          tenant_id: { type: "string", nullable: true }
        }
      },
      CurrentUserTenant: {
        nullable: true,
        oneOf: [
          {
            type: "object",
            required: ["id", "slug", "name", "role"],
            properties: {
              id: { type: "string" },
              slug: { type: "string" },
              name: { type: "string" },
              role: {
                type: "string",
                enum: tenantRoleValues
              }
            }
          }
        ]
      },
      CurrentUserResponse: {
        type: "object",
        required: ["principal", "role_context", "tenant", "target_app", "routing"],
        properties: {
          principal: { $ref: "#/components/schemas/CurrentUserPrincipal" },
          role_context: { $ref: "#/components/schemas/CurrentUserRoleContext" },
          tenant: { $ref: "#/components/schemas/CurrentUserTenant" },
          target_app: {
            type: "string",
            enum: authTargetAppValues
          },
          routing: { $ref: "#/components/schemas/AuthRouting" }
        }
      },
      AccessTokenResponse: {
        type: "object",
        required: ["access_token", "claims", "current_user"],
        properties: {
          access_token: { type: "string" },
          claims: { $ref: "#/components/schemas/JwtClaims" },
          current_user: { $ref: "#/components/schemas/CurrentUserResponse" }
        }
      },
      TenantProvisionRequest: {
        type: "object",
        required: ["name", "slug"],
        properties: {
          name: {
            type: "string",
            minLength: 2,
            maxLength: 120
          },
          slug: {
            type: "string",
            pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
            description: "Lowercase kebab-case tenant slug."
          }
        }
      },
      TenantProvisionResponse: {
        type: "object",
        required: ["tenant_id", "slug", "schema_name", "applied_versions", "status"],
        properties: {
          tenant_id: { type: "string" },
          slug: { type: "string" },
          schema_name: { type: "string" },
          applied_versions: {
            type: "array",
            items: { type: "string" }
          },
          status: {
            type: "string",
            enum: ["provisioned"]
          }
        }
      },
      TenantDirectoryListItem: {
        type: "object",
        required: ["tenantId", "name", "slug", "schemaName", "status", "createdAt", "updatedAt"],
        properties: {
          tenantId: { type: "string" },
          name: { type: "string" },
          slug: { type: "string" },
          schemaName: { type: "string" },
          status: {
            type: "string",
            enum: tenantStatusValues
          },
          createdAt: {
            type: "string",
            format: "date-time"
          },
          updatedAt: {
            type: "string",
            format: "date-time"
          }
        }
      },
      TenantDirectoryListFilter: {
        type: "object",
        properties: {
          name: {
            type: "string",
            minLength: 1,
            maxLength: 120
          },
          status: {
            type: "string",
            enum: tenantStatusValues
          }
        }
      },
      TenantDirectoryListRequest: {
        type: "object",
        required: ["filters"],
        properties: {
          filters: { $ref: "#/components/schemas/TenantDirectoryListFilter" }
        }
      },
      TenantDirectoryListFilters: {
        type: "object",
        required: ["name", "status"],
        properties: {
          name: { type: "string", nullable: true },
          status: {
            type: "string",
            nullable: true,
            enum: tenantStatusValues
          }
        }
      },
      TenantDirectoryListMeta: {
        type: "object",
        required: ["totalRecords", "filters"],
        properties: {
          totalRecords: {
            type: "integer",
            minimum: 0
          },
          filters: { $ref: "#/components/schemas/TenantDirectoryListFilters" }
        }
      },
      TenantDirectoryListData: {
        type: "object",
        required: ["tenantList"],
        properties: {
          tenantList: {
            type: "array",
            items: { $ref: "#/components/schemas/TenantDirectoryListItem" }
          }
        }
      },
      TenantDirectoryListResponse: {
        type: "object",
        required: ["data", "meta"],
        properties: {
          data: { $ref: "#/components/schemas/TenantDirectoryListData" },
          meta: { $ref: "#/components/schemas/TenantDirectoryListMeta" }
        }
      },
      DeprovisionType: {
        type: "string",
        enum: deprovisionTypeValues,
        default: DeprovisionTypeEnum.SOFT
      },
      DeprovisionTenantRequest: {
        type: "object",
        required: ["tenant_id"],
        properties: {
          tenant_id: { type: "string" },
          deprovisionType: { $ref: "#/components/schemas/DeprovisionType" }
        }
      },
      SoftDeprovisionTenantResponse: {
        type: "object",
        required: ["tenant_id", "slug", "schema_name", "previous_status", "status", "operation"],
        properties: {
          tenant_id: { type: "string" },
          slug: { type: "string" },
          schema_name: { type: "string" },
          previous_status: {
            type: "string",
            enum: tenantStatusValues
          },
          status: {
            type: "string",
            enum: ["inactive"]
          },
          operation: {
            type: "string",
            enum: ["soft_deprovisioned"]
          }
        }
      },
      HardDeprovisionTenantResponse: {
        type: "object",
        required: ["tenant_id", "slug", "schema_name", "previous_status", "status", "operation"],
        properties: {
          tenant_id: { type: "string" },
          slug: { type: "string" },
          schema_name: { type: "string" },
          previous_status: {
            type: "string",
            enum: tenantStatusValues
          },
          status: {
            type: "string",
            enum: ["hard_deprovisioned"]
          },
          operation: {
            type: "string",
            enum: ["hard_deprovisioned"]
          }
        }
      },
      TenantStatusCountEntry: {
        type: "object",
        required: ["status", "count"],
        properties: {
          status: {
            type: "string",
            enum: tenantStatusValues
          },
          count: {
            type: "integer",
            minimum: 0
          }
        }
      },
      DashboardMetricWindow: {
        type: "string",
        enum: dashboardMetricWindowValues
      },
      NewTenantCountMetric: {
        type: "object",
        required: ["window", "count"],
        properties: {
          window: {
            $ref: "#/components/schemas/DashboardMetricWindow"
          },
          count: {
            type: "integer",
            minimum: 0,
            description: "Count of tenants created inside the current trailing window ending at request time."
          }
        }
      },
      TenantGrowthRateMetric: {
        type: "object",
        required: ["window", "growth_rate_percentage"],
        properties: {
          window: {
            $ref: "#/components/schemas/DashboardMetricWindow"
          },
          growth_rate_percentage: {
            type: "number",
            description:
              "Percentage change between the current trailing window and the immediately preceding equal-length window, rounded to two decimals."
          }
        }
      },
      TenantSummaryWidget: {
        type: "object",
        required: [
          "total_tenant_count",
          "tenant_user_count",
          "tenant_status_counts",
          "new_tenant_counts",
          "tenant_growth_rates"
        ],
        properties: {
          total_tenant_count: {
            type: "integer",
            minimum: 0
          },
          tenant_user_count: {
            type: "integer",
            minimum: 0
          },
          tenant_status_counts: {
            type: "array",
            items: { $ref: "#/components/schemas/TenantStatusCountEntry" }
          },
          new_tenant_counts: {
            type: "array",
            description: "Ordered `week`, `month`, and `year` trailing-window tenant creation counts.",
            items: { $ref: "#/components/schemas/NewTenantCountMetric" }
          },
          tenant_growth_rates: {
            type: "array",
            description:
              "Ordered `week`, `month`, and `year` percentage changes comparing the current trailing window to the immediately preceding equal-length window.",
            items: { $ref: "#/components/schemas/TenantGrowthRateMetric" }
          }
        }
      },
      DashboardOverviewResponse: {
        type: "object",
        required: ["widgets"],
        properties: {
          widgets: {
            type: "object",
            required: ["tenant_summary"],
            properties: {
              tenant_summary: { $ref: "#/components/schemas/TenantSummaryWidget" }
            }
          }
        }
      }
    }
  },
  paths: {
    "/api/v1/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Authenticate with username or email",
        description: "Returns a signed JWT access token, decoded claims, and the current-user context.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" },
              examples: {
                username: {
                  value: {
                    identifier: "super.admin",
                    password: "SeedSuperAdmin123!"
                  }
                },
                email: {
                  value: {
                    identifier: "super-admin@acme-local.test",
                    password: "SeedSuperAdmin123!"
                  }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Authenticated response",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AccessTokenResponse" }
              }
            }
          },
          "400": errorResponse("Invalid login payload", "validation_error", "Invalid login payload"),
          "401": errorResponse("Invalid credentials", "invalid_credentials", "Invalid credentials"),
          "403": {
            description: "Account disabled or routing unavailable",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                examples: {
                  disabledAccount: {
                    value: {
                      error_code: "disabled_account",
                      message: "Account is disabled"
                    }
                  },
                  tenantMembershipRequired: {
                    value: {
                      error_code: "tenant_membership_required",
                      message: "An active tenant membership is required for this user",
                      routing: {
                        status: "access_denied",
                        target_app: null,
                        reason_code: "missing_active_tenant_membership"
                      }
                    }
                  },
                  tenantSelectionRequired: {
                    value: {
                      error_code: "tenant_selection_required",
                      message: "Tenant selection is required and is not yet supported",
                      routing: {
                        status: "selection_required",
                        target_app: null,
                        reason_code: "multiple_active_tenant_memberships"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Resolve the current authenticated user",
        description:
          "Returns principal, role context, tenant context when applicable, and the target app. Authenticated tenant users without a single active tenant membership receive a structured routing 403 response.",
        security: bearerSecurity,
        responses: {
          "200": {
            description: "Current-user response",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CurrentUserResponse" }
              }
            }
          },
          "401": errorResponse("Missing or invalid bearer token", "unauthenticated", "Missing bearer token"),
          "403": {
            description: "Authenticated user cannot be routed into a supported app target",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                examples: {
                  tenantMembershipRequired: {
                    value: {
                      error_code: "tenant_membership_required",
                      message: "An active tenant membership is required for this user",
                      routing: {
                        status: "access_denied",
                        target_app: null,
                        reason_code: "missing_active_tenant_membership"
                      }
                    }
                  },
                  tenantSelectionRequired: {
                    value: {
                      error_code: "tenant_selection_required",
                      message: "Tenant selection is required and is not yet supported",
                      routing: {
                        status: "selection_required",
                        target_app: null,
                        reason_code: "multiple_active_tenant_memberships"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Logout the current client session",
        description: "Stateless logout. Clients should discard the stored token locally.",
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: {
                type: "object",
                additionalProperties: false
              },
              examples: {
                empty: {
                  value: {}
                }
              }
            }
          }
        },
        responses: {
          "204": {
            description: "Logout accepted with no response body"
          },
          "400": errorResponse("Invalid logout payload", "validation_error", "Invalid logout payload")
        }
      }
    },
    "/api/v1/platform/ping": {
      get: {
        tags: ["Authorization"],
        summary: "Check platform-only access",
        description: "Protected example route for the platform namespace.",
        security: bearerSecurity,
        responses: {
          "200": {
            description: "Platform access allowed",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["ok", "namespace"],
                  properties: {
                    ok: { type: "boolean" },
                    namespace: { type: "string", enum: ["platform"] }
                  }
                }
              }
            }
          },
          "401": errorResponse("Unauthenticated request", "unauthenticated", "Missing bearer token"),
          "403": errorResponse("Role not allowed", "forbidden_role", "Insufficient role")
        }
      }
    },
    "/api/v1/platform/dashboard/overview": {
      get: {
        tags: ["Platform Dashboard"],
        summary: "Get super-admin dashboard overview widgets",
        description:
          "Protected super-admin route that returns dashboard summary metrics, including tenant totals, tenant-status counts, trailing new-tenant windows, and trailing growth-rate windows.",
        security: bearerSecurity,
        responses: {
          "200": {
            description: "Dashboard overview widgets",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/DashboardOverviewResponse" }
              }
            }
          },
          "401": errorResponse("Unauthenticated request", "unauthenticated", "Missing bearer token"),
          "403": errorResponse("Role not allowed", "forbidden_role", "Insufficient role")
        }
      }
    },
    "/api/v1/platform/tenants/search": {
      post: {
        tags: ["Platform Tenants"],
        summary: "Search tenants for the control plane",
        description:
          "Protected super-admin route that returns the tenant directory in the agreed `data` plus `meta` envelope. Accepts a request body with `filters.name` and `filters.status`.",
        security: bearerSecurity,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TenantDirectoryListRequest" }
            }
          }
        },
        responses: {
          "200": {
            description: "Tenant directory response",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TenantDirectoryListResponse" }
              }
            }
          },
          "400": errorResponse("Invalid tenant directory filter", "validation_error", "Invalid tenant directory filter"),
          "429": errorResponse("Rate limited request", "rate_limited", "Too many tenant directory requests"),
          "401": errorResponse("Unauthenticated request", "unauthenticated", "Missing bearer token"),
          "403": errorResponse("Role not allowed", "forbidden_role", "Insufficient role")
        }
      }
    },
    "/api/v1/tenant/admin/{tenantId}": {
      get: {
        tags: ["Authorization"],
        summary: "Check tenant-admin access",
        description: "Protected example route for tenant admin access scoped to a tenant.",
        security: bearerSecurity,
        parameters: [
          {
            name: "tenantId",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          "200": {
            description: "Tenant-admin access allowed",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["ok", "namespace"],
                  properties: {
                    ok: { type: "boolean" },
                    namespace: { type: "string", enum: ["tenant-admin"] }
                  }
                }
              }
            }
          },
          "401": errorResponse("Unauthenticated request", "unauthenticated", "Missing bearer token"),
          "403": errorResponse("Tenant or role not allowed", "forbidden_tenant", "Tenant access denied")
        }
      }
    },
    "/api/v1/tenant/user/{tenantId}": {
      get: {
        tags: ["Authorization"],
        summary: "Check tenant-user access",
        description: "Protected example route for tenant user access scoped to a tenant.",
        security: bearerSecurity,
        parameters: [
          {
            name: "tenantId",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          "200": {
            description: "Tenant-user access allowed",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["ok", "namespace"],
                  properties: {
                    ok: { type: "boolean" },
                    namespace: { type: "string", enum: ["tenant-user"] }
                  }
                }
              }
            }
          },
          "401": errorResponse("Unauthenticated request", "unauthenticated", "Missing bearer token"),
          "403": errorResponse("Tenant or role not allowed", "forbidden_role", "Insufficient role")
        }
      }
    },
    "/api/v1/platform/tenant": {
      post: {
        tags: ["Platform Tenants"],
        summary: "Provision a tenant",
        description: "Protected super-admin route used to create and provision a tenant.",
        security: bearerSecurity,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TenantProvisionRequest" }
            }
          }
        },
        responses: {
          "201": {
            description: "Tenant provisioned",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TenantProvisionResponse" }
              }
            }
          },
          "400": errorResponse(
            "Invalid tenant provisioning payload",
            "validation_error",
            "Invalid tenant provisioning payload"
          ),
          "401": errorResponse("Unauthenticated request", "unauthenticated", "Missing bearer token"),
          "403": errorResponse("Role not allowed", "forbidden_role", "Insufficient role"),
          "429": errorResponse("Rate limited", "rate_limited", "Too many tenant mutation requests"),
          "409": errorResponse("Tenant slug conflict", "conflict", "tenant slug already exists")
        }
      }
    },
    "/api/v1/platform/tenant/deprovision": {
      post: {
        tags: ["Platform Tenants"],
        summary: "Soft or hard deprovision a tenant",
        description:
          "Protected super-admin route used to soft deprovision a tenant by default or hard deprovision it when `deprovisionType` is `hard`. Hard deprovision drops the tenant schema and tenant-scoped metadata but retains the tenant record in `hard_deprovisioned`.",
        security: bearerSecurity,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/DeprovisionTenantRequest" }
            }
          }
        },
        responses: {
          "200": {
            description: "Tenant deprovisioned",
            content: {
              "application/json": {
                schema: {
                  oneOf: [
                    { $ref: "#/components/schemas/SoftDeprovisionTenantResponse" },
                    { $ref: "#/components/schemas/HardDeprovisionTenantResponse" }
                  ]
                }
              }
            }
          },
          "400": errorResponse("Invalid tenant deprovision payload", "validation_error", "Invalid tenant deprovision payload"),
          "401": errorResponse("Unauthenticated request", "unauthenticated", "Missing bearer token"),
          "403": errorResponse("Role not allowed", "forbidden_role", "Insufficient role"),
          "429": errorResponse("Rate limited", "rate_limited", "Too many tenant mutation requests"),
          "404": errorResponse("Tenant not found", "not_found", "Tenant was not found"),
          "409": errorResponse("Tenant deprovision conflict", "conflict", "Tenant deprovision request conflicts with current tenant state")
        }
      }
    }
  }
};
