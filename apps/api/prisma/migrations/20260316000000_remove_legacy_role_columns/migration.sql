-- Remove legacy role columns from users and tenant_memberships tables
-- These are now normalized into UserPlatformRoleAssignment and TenantMembershipRoleAssignment

ALTER TABLE "users" DROP COLUMN "role";

ALTER TABLE "tenant_memberships" DROP COLUMN "role";
