import { SLUG_REGEX } from "./contracts.js";

export const normalizeSlug = (input: string): string => input.trim().toLowerCase();

export const validateSlug = (slug: string): boolean => SLUG_REGEX.test(slug);

export const deriveTenantSchemaName = (slug: string): string => `tenant_${slug}`;
