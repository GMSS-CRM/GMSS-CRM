import { injectable } from 'inversify';
import {
  IVendorPaymentService,
  PaymentScheduleItem,
  PaymentScheduleResponse,
} from './types';

@injectable()
export class VendorPaymentService
  implements IVendorPaymentService
{
  generateSchedule(
    totalAmount: number,
    frequency: string,
    gstApplicable: boolean,
    startDate: Date
  ): PaymentScheduleResponse {
    let months = 12;

    if (frequency === 'MONTHLY') months = 12;
    if (frequency === 'QUARTERLY') months = 4;
    if (frequency === 'YEARLY') months = 1;

    const installmentAmount = totalAmount / months;

    const schedule: PaymentScheduleItem[] = [];

    for (let i = 0; i < months; i++) {
      const dueDate = new Date(startDate);
      dueDate.setMonth(startDate.getMonth() + i * (12 / months));

      const gstAmount = gstApplicable
        ? installmentAmount * 0.18
        : 0;

      schedule.push({
        installmentNumber: i + 1,
        dueDate,
        baseAmount: installmentAmount,
        gstAmount,
        totalAmount: installmentAmount + gstAmount,
      });
    }

    return {
      frequency,
      totalInstallments: months,
      schedule,
    };
  }
}
