import { z } from "zod";

export const AccountStatusSchema = z.enum(["active", "disabled", "inactive"]);
export type AccountStatus = z.infer<typeof AccountStatusSchema>;

export const isDisabledAccountStatus = (status: AccountStatus): boolean =>
  status === "disabled" || status === "inactive";
