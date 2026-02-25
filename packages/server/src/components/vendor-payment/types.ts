export interface PaymentScheduleItem {
  installmentNumber: number;
  dueDate: Date;
  baseAmount: number;
  gstAmount: number;
  totalAmount: number;
}

export interface PaymentScheduleResponse {
  frequency: string;
  totalInstallments: number;
  schedule: PaymentScheduleItem[];
}

export interface IVendorPaymentService {
  generateSchedule(
    totalAmount: number,
    frequency: string,
    gstApplicable: boolean,
    startDate: Date
  ): PaymentScheduleResponse;
}
