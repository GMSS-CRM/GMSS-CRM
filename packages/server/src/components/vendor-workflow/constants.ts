import { VendorStatus } from '../../entities/enums/VendorStatus';

export const VALID_VENDOR_TRANSITIONS: Record<VendorStatus, VendorStatus[]> = {
  [VendorStatus.NEW]: [
    VendorStatus.INTERESTED,
    VendorStatus.NOT_INTERESTED,
  ],

  [VendorStatus.INTERESTED]: [
    VendorStatus.PENDING_MD_APPROVAL,
  ],

  [VendorStatus.PENDING_MD_APPROVAL]: [
    VendorStatus.APPROVED,
    VendorStatus.NOT_INTERESTED,
  ],

  [VendorStatus.APPROVED]: [
    VendorStatus.FINAL,
  ],

  [VendorStatus.NOT_INTERESTED]: [
    VendorStatus.DELETED,
  ],

  [VendorStatus.FINAL]: [],

  [VendorStatus.DELETED]: [],
};
