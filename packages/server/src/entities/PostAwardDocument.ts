import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { TenderPostAward } from './TenderPostAward';
import { PostAwardStage } from './enums/PostAwardStage';

/**
 * Supports multiple document uploads per post-award stage.
 * Each stage (Order Processing, Inspection, Dispatch, etc.) can have many documents.
 */
@Entity({ name: 'post_award_document' })
export class PostAwardDocument {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  postAwardId!: string;

  @Column()
  tenderId!: string;

  @Column({
    type: 'enum',
    enum: PostAwardStage,
  })
  stage!: PostAwardStage;

  /** e.g. PO, Security Deposit, Inspection Certificate, Sales Invoice, Eway Bill, etc. */
  @Column()
  documentType!: string;

  @Column()
  documentName!: string;

  @Column()
  documentUrl!: string;

  @Column({ type: 'text', nullable: true })
  remarks?: string;

  @Column({ default: 'SYSTEM' })
  uploadedBy!: string;

  @CreateDateColumn()
  createdDate!: Date;

  /* ── Relations ────────────────────────────────────────── */

  @ManyToOne(() => TenderPostAward, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postAwardId' })
  postAward!: TenderPostAward;
}
