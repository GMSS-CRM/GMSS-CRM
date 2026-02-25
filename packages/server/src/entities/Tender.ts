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

  @Column({ default: 'SYSTEM' })
  createdBy!: string;

  @Column({ nullable: true })
  updatedBy?: string;

  @CreateDateColumn()
  createdDate!: Date;

  @UpdateDateColumn()
  updatedDate!: Date;

  @OneToMany('TenderDocument', 'tender', { cascade: true })
  documents!: TenderDocument[];

  @OneToMany('TenderTag', 'tender', { cascade: true })
  tags!: TenderTag[];
}
