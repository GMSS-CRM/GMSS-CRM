import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Vendor } from './Vendor';

export enum SignatureStatus {
  PENDING = 'PENDING',
  SIGNED = 'SIGNED',
  EXPIRED = 'EXPIRED',
}

export enum CommissionType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
}

export enum CommissionStructure {
  SPLIT_50_50 = 'SPLIT_50_50',
  FULL_ON_PAYMENT = 'FULL_ON_PAYMENT',
}

export enum PaymentFrequency {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
}

export enum PaymentTermType {
  ADVANCE_PAYMENT = 'ADVANCE_PAYMENT',
  PAYMENT_WITHIN_30_DAYS = 'PAYMENT_WITHIN_30_DAYS',
  PAYMENT_AFTER_30_DAYS = 'PAYMENT_AFTER_30_DAYS',
}

@Entity({ name: 'vendor_agreement' })
export class VendorAgreement {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  vendorId!: string;

  /* AGREEMENT DATES */

  @Column()
  agreementStartDate!: Date;

  @Column()
  agreementEndDate!: Date;

  @Column({ nullable: true })
  renewalReminderDate?: Date;

  /* SIGNATURE */

  @Column({
    type: 'enum',
    enum: SignatureStatus,
    default: SignatureStatus.PENDING,
  })
  signatureStatus!: SignatureStatus;

  @Column({ nullable: true })
  signedDate?: Date;

  /* COMMISSION */

  @Column({
    type: 'enum',
    enum: CommissionType,
    nullable: true,
  })
  commissionType?: CommissionType;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  commissionValue?: number;

  @Column({
    type: 'enum',
    enum: CommissionStructure,
    nullable: true,
  })
  commissionStructure?: CommissionStructure;

  /* PAYMENT TERMS */

  @Column({
    type: 'enum',
    enum: PaymentTermType,
    nullable: true,
  })
  paymentTermType?: PaymentTermType;

  @Column({
    type: 'enum',
    enum: PaymentFrequency,
    nullable: true,
  })
  paymentFrequency?: PaymentFrequency;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  paymentAmount?: number;

  @Column({ default: true })
  gstApplicable!: boolean;

  /* OTHER BENEFITS */

  @Column({ default: false })
  hasOtherBenefits!: boolean;

  @Column({ nullable: true })
  otherBenefitsDescription?: string;

  /* DOCUMENT */

  @Column({ nullable: true })
  documentUrl?: string;

  @Column({ nullable: true })
  documentPath?: string;

  /* AUDIT */

  @Column({ default: 'SYSTEM' })
  createdBy!: string;

  @CreateDateColumn()
  createdDate!: Date;

  @Column({ nullable: true })
  updatedBy?: string;

  @UpdateDateColumn()
  updatedDate!: Date;

  /* RELATION */

  @ManyToOne(() => Vendor, (vendor) => vendor.agreements, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'vendorId' })
  vendor!: Vendor;
}
