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
import { Tender } from './Tender';

export enum ParticipationStatus {
  PENDING = 'PENDING',
  PARTICIPATED = 'PARTICIPATED',
  REJECTED = 'REJECTED',
}

export enum VendorInterestStatus {
  PENDING    = 'PENDING',
  INTERESTED = 'INTERESTED',
  NOT_INTERESTED = 'NOT_INTERESTED',
}

export enum EmdSource {
  NEFT  = 'NEFT',
  BG    = 'BG',    // Bank Guarantee
  FDR   = 'FDR',
  DD    = 'DD',    // Demand Draft
}

export enum TabulationType {
  FINANCIAL  = 'FINANCIAL',
  TECHNICAL  = 'TECHNICAL',
  BOTH       = 'BOTH',
}

@Entity({ name: 'vendor_tender' })
export class VendorTender {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  vendorId!: string;

  @Column()
  tenderId!: string;

  @Column({ nullable: true })
  sharedDate?: Date;

  /* ── Legacy participation fields ──────────────────────── */

  @Column({ default: false })
  isParticipating!: boolean;

  @Column({
    type: 'enum',
    enum: ParticipationStatus,
    default: ParticipationStatus.PENDING,
  })
  participationStatus!: ParticipationStatus;

  /* ── Step 0: Interest Status ────────────────────────────
     After mail is sent the team follows up to gauge interest  */

  @Column({
    type: 'enum',
    enum: VendorInterestStatus,
    default: VendorInterestStatus.PENDING,
  })
  interestStatus!: VendorInterestStatus;

  @Column({ type: 'text', nullable: true })
  notInterestedReason?: string;

  /* ── Step 1 (New): Share Proposal ───────────────────── */

  @Column({ default: false })
  proposalShared!: boolean;

  /* ── Step 1 (Interested/New): Tie-Up Agreement ───────── */

  @Column({ default: false })
  tieUpAgreementObtained!: boolean;

  /* ── Step 2: Quote ────────────────────────────────────── */

  @Column({ default: false })
  quoteReceived!: boolean;

  @Column({ nullable: true })
  quoteUrl?: string;

  @Column({ nullable: true })
  quotedAmount?: number;

  @Column({ default: false })
  quoteApproved!: boolean;   // checked by Nikhil/Nishant Sir

  /* ── Step 3: Documents ───────────────────────────────── */

  @Column({ default: false })
  companyDocsUploaded!: boolean;

  @Column({ default: false })
  tenderDocsUploaded!: boolean;

  /* ── Step 4: EMD (Earnest Money Deposit) ─────────────── */

  @Column({ default: false })
  emdRequired!: boolean;

  @Column({
    type: 'enum',
    enum: EmdSource,
    nullable: true,
  })
  emdSource?: EmdSource;

  @Column({ type: 'float', nullable: true })
  emdAmount?: number;

  @Column({ default: false })
  emdPaid!: boolean;

  /* ── Step 5: Tabulations ─────────────────────────────── */

  @Column({
    type: 'enum',
    enum: TabulationType,
    nullable: true,
  })
  tabulationType?: TabulationType;

  @Column({ default: false })
  tabulationUploaded!: boolean;

  @Column({ default: false })
  tabulationApproved!: boolean;  // checked by Nikhil/Nishant Sir

  /* ── Final decision ──────────────────────────────────── */

  // Overall decision on whether this vendor will participate
  @Column({ type: 'text', nullable: true })
  participationDecisionReason?: string;

  @Column({ type: 'text', nullable: true })
  followUpRemarks?: string;

  /* ── Metadata ─────────────────────────────────────────── */

  @CreateDateColumn()
  createdDate!: Date;

  @UpdateDateColumn()
  updatedDate!: Date;

  /* ── Relations ────────────────────────────────────────── */

  @ManyToOne(() => Vendor, (vendor) => vendor.tenders, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'vendorId' })
  vendor!: Vendor;

  @ManyToOne(() => Tender, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tenderId' })
  tender!: Tender;
}

