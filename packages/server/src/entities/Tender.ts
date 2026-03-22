import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { TenderDocument } from './TenderDocument';
import type { TenderTag } from './TenderTag';
import { TenderStatus } from './enums/TenderStatus';

export enum SourcePortal {
  IREPS = 'IREPS',
  GEM = 'GEM',
  OTHER = 'OTHER',
}

export enum TenderType {
  NORMAL = 'NORMAL',
  LIMITED = 'LIMITED',
}

@Entity({ name: 'tender' })
export class Tender {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  referenceNumber?: string;

  @Column({ nullable: true })
  issuingDepartment?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: TenderStatus,
    default: TenderStatus.DRAFT,
  })
  status!: TenderStatus;

  @Column({ type: 'timestamp', nullable: true })
  submissionDeadline?: Date;

  @Column({ type: 'text', nullable: true })
  rejectionReason?: string;

  @Column({ type: 'timestamp', nullable: true })
  mailSentAt?: Date;

  /* ── New workflow fields ──────────────────────────────── */

  @Column({ type: 'enum', enum: SourcePortal, nullable: true })
  sourcePortal?: SourcePortal;

  @Column({ type: 'enum', enum: TenderType, nullable: true })
  tenderType?: TenderType;

  @Column({ default: false })
  isLoadedOnPortal!: boolean;

  @Column({ default: false })
  agApprovalRequired!: boolean;

  @Column({ nullable: true })
  isFeasible?: boolean;

  @Column({ type: 'text', nullable: true })
  feasibilityRemarks?: string;

  @Column({ default: false })
  closingDateChanged!: boolean;

  @Column({ nullable: true })
  closingDateProofUrl?: string;

  @Column({ type: 'timestamp', nullable: true })
  updatedSubmissionDeadline?: Date;

  @Column({ nullable: true })
  mailCheckProofUrl?: string;

  @Column({ type: 'text', nullable: true })
  countdownSilenceReason?: string;

  @Column({ default: 'SYSTEM' })
  createdBy!: string;

  @Column({ nullable: true })
  updatedBy?: string;

  @CreateDateColumn()
  createdDate!: Date;

  @UpdateDateColumn()
  updatedDate!: Date;

  @Column({ default: false })
  isDeleted!: boolean;

  @Column({ nullable: true })
  deletedBy?: string;

  @Column({ type: 'timestamp', nullable: true })
  deletedDate?: Date;

  @OneToMany('TenderDocument', 'tender', { cascade: true })
  documents!: TenderDocument[];

  @OneToMany('TenderTag', 'tender', { cascade: true })
  tags!: TenderTag[];
}
