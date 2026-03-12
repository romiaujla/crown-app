const bearerSecurity = [{ bearerAuth: [] }];

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
        enum: ["super_admin", "tenant_admin", "tenant_user"]
      },
      PlatformUserAccountStatus: {
        type: "string",
        enum: ["active", "disabled", "inactive"]
      },
      JwtClaims: {
        type: "object",
        required: ["sub", "role", "tenant_id"],
        properties: {
          sub: { type: "string" },
          role: { $ref: "#/components/schemas/Role" },
          tenant_id: { type: "string", nullable: true }
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
            enum: [
              "validation_error",
              "unauthenticated",
              "invalid_credentials",
              "disabled_account",
              "invalid_claims",
              "tenant_membership_required",
              "tenant_selection_required",
              "forbidden_role",
              "forbidden_tenant",
              "conflict",
              "migration_failed"
            ]
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
            enum: ["allowed", "access_denied", "selection_required"]
          },
          target_app: {
            type: "string",
            nullable: true,
            enum: ["platform", "tenant"]
          },
          reason_code: {
            type: "string",
            nullable: true,
            enum: ["missing_active_tenant_membership", "multiple_active_tenant_memberships"]
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
                enum: ["tenant_admin", "tenant_user"]
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
            enum: ["platform", "tenant"]
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
      }
    }
  },
  paths: {
    "/api/v1/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Authenticate with username or email",
        description: "Returns a local access token, decoded claims, and the current-user context.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" },
              examples: {
                username: {
                  value: {
                    identifier: "super.admin",
                    password: "Password123!"
                  }
                },
                email: {
                  value: {
                    identifier: "super-admin@acme-local.test",
                    password: "Password123!"
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
    "/api/v1/platform/tenants": {
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
          "409": errorResponse("Tenant slug conflict", "conflict", "tenant slug already exists")
        }
      }
    }
  }
};
