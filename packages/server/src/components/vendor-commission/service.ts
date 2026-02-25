import { injectable } from 'inversify';
import {
  CommissionBreakdown,
  IVendorCommissionService,
} from './types';

@injectable()
export class VendorCommissionService
  implements IVendorCommissionService
{
  calculateCommission(
    baseAmount: number,
    commissionType: string,
    commissionValue: number,
    gstApplicable: boolean
  ): CommissionBreakdown {
    let commissionAmount = 0;

    if (commissionType === 'PERCENTAGE') {
      commissionAmount = (baseAmount * commissionValue) / 100;
    }

    if (commissionType === 'FIXED') {
      commissionAmount = commissionValue;
    }

    const gstAmount = gstApplicable
      ? commissionAmount * 0.18
      : 0;

    return {
      baseAmount,
      commissionAmount,
      gstAmount,
      totalAmount: commissionAmount + gstAmount,
    };
  }
}
