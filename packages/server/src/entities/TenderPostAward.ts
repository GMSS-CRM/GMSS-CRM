import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Tender } from './Tender';
import { PostAwardStage } from './enums/PostAwardStage';

@Entity({ name: 'tender_post_award' })
export class TenderPostAward {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  tenderId!: string;

  @Column({
    type: 'enum',
    enum: PostAwardStage,
    default: PostAwardStage.ORDER_FOLLOWUP,
  })
  currentStage!: PostAwardStage;

  /* ── Stage 1: Order Follow-Up ─────────────────────────── */

  @Column({ nullable: true })
  tenderOfficerName?: string;

  @Column({ nullable: true })
  tenderOfficerPhone?: string;

  @Column({ nullable: true })
  tenderOfficerEmail?: string;

  @Column({ type: 'text', nullable: true })
  followUpRemarks?: string;

  @Column({ default: false })
  loaReceived!: boolean;

  @Column({ nullable: true })
  poNumber?: string;

  @Column({ type: 'timestamp', nullable: true })
  poDate?: Date;

  @Column({ default: false })
  emdReturnReceived!: boolean;

  @Column({ type: 'float', nullable: true })
  emdAmount?: number;

  @Column({ nullable: true })
  emdAdviceNumber?: string;

  @Column({ type: 'timestamp', nullable: true })
  emdReceivedDate?: Date;

  /* ── Stage 2: Order Processing ────────────────────────── */

  @Column({ default: false })
  poUploaded!: boolean;

  @Column({ nullable: true })
  poDocumentUrl?: string;

  @Column({ default: false })
  commissionPaymentRequired!: boolean;  // for manufacturers

  @Column({ default: false })
  securityDepositRequired!: boolean;

  @Column({ nullable: true })
  securityDepositType?: string;  // DD, FDR, Bank Guarantee, NEFT

  @Column({ type: 'float', nullable: true })
  securityDepositAmount?: number;

  @Column({ type: 'timestamp', nullable: true })
  securityDepositDueDate?: Date;

  @Column({ nullable: true })
  sdCourierDetails?: string;

  @Column({ nullable: true })
  sdDocumentUrl?: string;

  @Column({ type: 'int', nullable: true })
  deliveryDeadlineDays?: number;  // up to 60

  @Column({ default: false })
  poReleasedToVendor!: boolean;

  @Column({ type: 'timestamp', nullable: true })
  poReleasedDate?: Date;

  @Column({ default: false })
  extensionRequested!: boolean;

  @Column({ type: 'text', nullable: true })
  extensionReason?: string;

  @Column({ type: 'timestamp', nullable: true })
  newDeliveryDate?: Date;

  @Column({ default: false })
  extensionAccepted!: boolean;

  @Column({ nullable: true })
  moaDocumentUrl?: string;  // Modification of Advice

  @Column({ default: false })
  ldcApplicable!: boolean;

  @Column({ type: 'float', nullable: true })
  ldcPercentage?: number;

  @Column({ nullable: true })
  lateDeliveryBy?: string;  // GMSS or Vendor/Manufacturer

  /* ── Stage 3: Inspection ─────────────────────────────── */

  @Column({ default: false })
  inspectionRequired!: boolean;

  @Column({ nullable: true })
  tpiAgencyName?: string;

  @Column({ nullable: true })
  tpiOfficerName?: string;

  @Column({ nullable: true })
  tpiOfficerContact?: string;

  @Column({ type: 'timestamp', nullable: true })
  tpiVisitSchedule?: Date;

  @Column({ default: false })
  inspectionDone!: boolean;

  @Column({ nullable: true })
  inspectionCertificateUrl?: string;

  /* ── Stage 4: Dispatch & Delivery ─────────────────────── */

  @Column({ default: false })
  purchaseInvoiceReceived!: boolean;

  @Column({ nullable: true })
  courierCompanyName?: string;

  @Column({ nullable: true })
  courierContact?: string;

  @Column({ nullable: true })
  podNumber?: string;

  @Column({ nullable: true })
  consignmentNumber?: string;

  @Column({ type: 'timestamp', nullable: true })
  actualDeliveryDate?: Date;

  @Column({ nullable: true })
  proofOfDeliveryUrl?: string;

  @Column({ type: 'float', nullable: true })
  ldcGivenPercentage?: number;

  @Column({ type: 'float', nullable: true })
  ldcRailwayPoValue?: number;

  @Column({ type: 'float', nullable: true })
  ldcCalculatedTotal?: number;

  @Column({ nullable: true })
  ldcInvoiceUrl?: string;

  @Column({ default: false })
  receiptNoteReceived!: boolean;

  @Column({ type: 'text', nullable: true })
  receiptNoteDetails?: string;

  /* ── Stage 5: Warranty Rejections ───────────────────── */

  @Column({ default: false })
  warrantyRejectionApplicable!: boolean;

  @Column({ type: 'text', nullable: true })
  warrantyRejectionReason?: string;

  @Column({ nullable: true })
  warrantyAdviceNumber?: string;

  @Column({ nullable: true })
  warrantyPoNumber?: string;

  @Column({ type: 'timestamp', nullable: true })
  warrantyPoDate?: Date;

  @Column({ nullable: true })
  warrantyInvoiceNumber?: string;

  @Column({ type: 'timestamp', nullable: true })
  warrantyInvoiceDate?: Date;

  @Column({ nullable: true })
  warrantyCompanyName?: string;

  @Column({ nullable: true })
  warrantyConsigneeName?: string;

  @Column({ nullable: true })
  warrantyConsigneeNumber?: string;

  @Column({ nullable: true })
  warrantyPeriod?: string;

  @Column({ default: false })
  warrantyEngineerVisit!: boolean;

  @Column({ nullable: true })
  warrantyEngineerName?: string;

  @Column({ nullable: true })
  warrantyEngineerContact?: string;

  @Column({ type: 'timestamp', nullable: true })
  warrantyEngineerVisitDate?: Date;

  @Column({ nullable: true })
  warrantyJointReportUrl?: string;

  @Column({ nullable: true })
  warrantyAction?: string;  // dispatch | engineer

  @Column({ default: false })
  warrantyWithin60Days!: boolean;

  @Column({ default: false })
  runningBillDeduction!: boolean;

  @Column({ nullable: true })
  warrantyRejectionWithdrawalUrl?: string;

  @Column({ nullable: true })
  warrantyRecoveryRefundUrl?: string;

  @Column({ nullable: true })
  warrantySupplementaryInvoiceUrl?: string;

  /* ── Stage 6: Bill Submission & Payments ────────────── */

  @Column({ default: false })
  billUploaded!: boolean;

  @Column({ nullable: true })
  paymentDepartmentName?: string;

  @Column({ nullable: true })
  paymentOfficerName?: string;

  @Column({ nullable: true })
  paymentOfficerContact?: string;

  @Column({ nullable: true })
  paymentStatus?: string;  // full | partial | deduction

  @Column({ type: 'text', nullable: true })
  paymentRemarks?: string;

  @Column({ type: 'text', nullable: true })
  deductionReason?: string;

  @Column({ default: false })
  debitNoteProvided!: boolean;

  @Column({ default: false })
  commissionInvoiceProvided!: boolean;

  @Column({ default: false })
  sdReleased!: boolean;

  @Column({ type: 'text', nullable: true })
  sdReleaseDepartmentDetails?: string;

  /* ── Metadata ────────────────────────────────────────── */

  @Column({ default: 'SYSTEM' })
  createdBy!: string;

  @CreateDateColumn()
  createdDate!: Date;

  @Column({ nullable: true })
  updatedBy?: string;

  @UpdateDateColumn()
  updatedDate!: Date;

  /* ── Relations ────────────────────────────────────────── */

  @ManyToOne(() => Tender, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenderId' })
  tender!: Tender;
}
