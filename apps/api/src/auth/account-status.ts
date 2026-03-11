import {
  PlatformUserAccountStatus,
  PlatformUserAccountStatusSchema,
  type PlatformUserAccountStatus as PlatformUserAccountStatusValue
} from "../domain/status-enums.js";

export const AccountStatusSchema = PlatformUserAccountStatusSchema;
export type AccountStatus = PlatformUserAccountStatusValue;

export const isDisabledAccountStatus = (status: AccountStatus): boolean =>
  status === PlatformUserAccountStatus.disabled || status === PlatformUserAccountStatus.inactive;
