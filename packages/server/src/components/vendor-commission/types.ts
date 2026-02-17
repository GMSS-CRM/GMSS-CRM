export interface CommissionBreakdown {
  baseAmount: number;
  commissionAmount: number;
  gstAmount: number;
  totalAmount: number;
}

export interface IVendorCommissionService {
  calculateCommission(
    baseAmount: number,
    commissionType: string,
    commissionValue: number,
    gstApplicable: boolean
  ): CommissionBreakdown;
}
