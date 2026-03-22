import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum NotificationType {
  PAYMENT_DUE = 'PAYMENT_DUE',
  SD_RELEASE = 'SD_RELEASE',
  DOCUMENT_EXPIRY = 'DOCUMENT_EXPIRY',
  AGREEMENT_RENEWAL = 'AGREEMENT_RENEWAL',
  FOLLOW_UP_DUE = 'FOLLOW_UP_DUE',
  TENDER_DEADLINE = 'TENDER_DEADLINE',
  TASK_ASSIGNED = 'TASK_ASSIGNED',
  GENERAL = 'GENERAL',
}

@Entity({ name: 'notification' })
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: true })
  userId?: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.GENERAL,
  })
  type!: NotificationType;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  body?: string;

  @Column({ nullable: true })
  referenceId?: string;

  @Column({ nullable: true })
  referenceType?: string; // tender, vendor, agreement, ticket, etc.

  @Column({ default: false })
  isRead!: boolean;

  @Column({ default: false })
  isDismissed!: boolean;

  @CreateDateColumn()
  createdDate!: Date;
}
