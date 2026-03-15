import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Tender } from './Tender';

/**
 * Tracks all actions/events on a tender throughout its lifecycle.
 * Provides the "activity timeline" view for each tender.
 */
@Entity({ name: 'tender_activity_log' })
export class TenderActivityLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  tenderId!: string;

  /** e.g. STATUS_CHANGE, DOCUMENT_UPLOAD, VENDOR_FOLLOW_UP, STAGE_ADVANCE, etc. */
  @Column()
  action!: string;

  /** Human-readable description: "Tender status changed from DRAFT to PENDING_MD_TAGGING" */
  @Column({ type: 'text' })
  description!: string;

  /** Optional JSON metadata for the event */
  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, unknown>;

  /** Who performed the action */
  @Column({ default: 'SYSTEM' })
  performedBy!: string;

  @CreateDateColumn()
  createdDate!: Date;

  /* ── Relations ────────────────────────────────────────── */

  @ManyToOne(() => Tender, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenderId' })
  tender!: Tender;
}
