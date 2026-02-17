import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Vendor } from './Vendor';

export enum FollowUpType {
  PROPOSAL = 'PROPOSAL',
  AGREEMENT = 'AGREEMENT',
  DOCUMENT = 'DOCUMENT',
  RENEWAL = 'RENEWAL',
  PAYMENT = 'PAYMENT',
}

@Entity({ name: 'vendor_followup' })
export class VendorFollowUp {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  vendorId!: string;

  @Column({
    type: 'enum',
    enum: FollowUpType,
  })
  type!: FollowUpType;

  @Column()
  nextFollowUpDate!: Date;

  @Column({ nullable: true })
  remarks?: string;

  @Column({ default: false })
  isCompleted!: boolean;

  @Column({ default: false })
  reminderSent!: boolean;

  @CreateDateColumn()
  createdDate!: Date;

  @Column({ default: 'SYSTEM' })
  createdBy!: string;

  @ManyToOne(() => Vendor, (vendor) => vendor.followUps, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'vendorId' })
  vendor!: Vendor;
}
