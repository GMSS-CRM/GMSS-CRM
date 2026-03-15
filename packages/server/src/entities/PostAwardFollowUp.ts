import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TenderPostAward } from './TenderPostAward';
import { PostAwardStage } from './enums/PostAwardStage';

export enum FollowUpPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

/**
 * Follow-up reminders for post-award stages.
 * Enables "follow up every 5–7 days" for order tracking, payments, SD release, etc.
 */
@Entity({ name: 'post_award_follow_up' })
export class PostAwardFollowUp {
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

  @Column({
    type: 'enum',
    enum: FollowUpPriority,
    default: FollowUpPriority.MEDIUM,
  })
  priority!: FollowUpPriority;

  @Column({ type: 'text', nullable: true })
  remarks?: string;

  /** Who was contacted or needs to be contacted */
  @Column({ nullable: true })
  contactPerson?: string;

  @Column({ nullable: true })
  contactPhone?: string;

  @Column({ nullable: true })
  contactEmail?: string;

  @Column({ type: 'timestamp', nullable: true })
  followUpDate?: Date;

  @Column({ type: 'timestamp', nullable: true })
  nextFollowUpDate?: Date;

  @Column({ default: false })
  isCompleted!: boolean;

  @Column({ type: 'text', nullable: true })
  outcome?: string;

  @Column({ default: 'SYSTEM' })
  createdBy!: string;

  @CreateDateColumn()
  createdDate!: Date;

  @UpdateDateColumn()
  updatedDate!: Date;

  /* ── Relations ────────────────────────────────────────── */

  @ManyToOne(() => TenderPostAward, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postAwardId' })
  postAward!: TenderPostAward;
}
