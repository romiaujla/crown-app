import { PlatformUserAccountStatus } from "../domain/status-enums.js";

export const isDisabledAccountStatus = (status: PlatformUserAccountStatus): boolean =>
  status === PlatformUserAccountStatus.disabled || status === PlatformUserAccountStatus.inactive;
