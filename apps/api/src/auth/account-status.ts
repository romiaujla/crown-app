import {
  PlatformUserAccountStatus,
  PlatformUserAccountStatusSchema
} from "../domain/status-enums.js";

export const AccountStatusSchema = PlatformUserAccountStatusSchema;

export const isDisabledAccountStatus = (status: PlatformUserAccountStatus): boolean =>
  status === PlatformUserAccountStatus.disabled || status === PlatformUserAccountStatus.inactive;
