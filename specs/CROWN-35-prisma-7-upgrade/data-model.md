# Data Model: Upgrade Repository Prisma Tooling To Prisma 7

## Overview

`CROWN-35` does not introduce new product entities. It defines the infrastructure objects and compatibility expectations required to move the repository from Prisma 5 to Prisma 7.

## Upgrade Entities

### PrismaBaseline

- **Purpose**: Represents the supported Prisma version family and package set used by the repository.
- **Key attributes**:
  - Prisma CLI version
  - Prisma client version
  - PostgreSQL adapter dependency
  - supported Node.js runtime assumption
- **Validation rules**:
  - Must align CLI and client package versions
  - Must remain compatible with the repository’s API workspace

### PrismaClientGenerationContract

- **Purpose**: Represents how Prisma Client is generated and imported under Prisma 7.
- **Key attributes**:
  - generator provider
  - generated output path
  - import path used by application code
  - explicit generation command surface
- **Repository shape**:
  - generated output path: `apps/api/src/generated/prisma`
  - application import path: `../generated/prisma/client.js`
- **Validation rules**:
  - Must avoid deprecated Prisma 5 generation assumptions
  - Must be stable enough for application code and typecheck to consume directly

### PrismaConfigContract

- **Purpose**: Represents the Prisma CLI configuration model used by the API workspace.
- **Key attributes**:
  - schema path
  - datasource URL source
  - migrations path
  - seed command
- **Repository shape**:
  - config file path: `apps/api/prisma.config.ts`
- **Validation rules**:
  - Must support repository Prisma commands without environment-loading ambiguity
  - Must remain aligned to the API workspace layout

### PrismaWorkflowSurface

- **Purpose**: Represents the repository commands and scripts that rely on Prisma behavior.
- **Key attributes**:
  - repository-level database commands
  - API workspace seed command
  - tenant migration generator
  - generated-client refresh path
- **Validation rules**:
  - Must preserve the supported command choices contributors already use
  - Must make explicit any new generation expectations introduced by Prisma 7

### UpgradeValidationSurface

- **Purpose**: Represents the focused test and command coverage used to prove the Prisma 7 upgrade did not break the current foundation workflows.
- **Key attributes**:
  - typecheck surface
  - tenant provisioning validation
  - tenant migration validation
  - seed and bootstrap validation
- **Validation rules**:
  - Must cover the Prisma-dependent workflows with the highest regression risk
  - Must remain focused on infrastructure compatibility rather than new product behavior

## Upgrade States

### Starting State

- The API workspace uses Prisma 5 package versions.
- Prisma client imports come from `@prisma/client`.
- Prisma schema generation still assumes the older generator baseline.
- Repository commands do not yet reflect Prisma 7 configuration and generation expectations.

### Completed State

- The API workspace uses aligned Prisma 7 packages and PostgreSQL adapter support.
- Generated Prisma client code is produced through the supported Prisma 7 generator and imported from an explicit workspace path.
- Prisma CLI configuration is explicit and repository-local to the API workspace.
- Repository Prisma workflows remain usable for provisioning, migration generation, seeding, and bootstrap validation.

## Relationships

- `PrismaBaseline` constrains `PrismaClientGenerationContract`
- `PrismaConfigContract` configures `PrismaWorkflowSurface`
- `PrismaWorkflowSurface` is validated by `UpgradeValidationSurface`
- `PrismaClientGenerationContract` feeds the application’s Prisma client imports and related type references
