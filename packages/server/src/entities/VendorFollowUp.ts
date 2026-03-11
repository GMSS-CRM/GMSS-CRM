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

export enum FollowUpType {
  EMAIL = 'EMAIL',
  HARD_COPY_COURIER = 'HARD_COPY_COURIER',
  DIGITAL_SIGNATURE_COURIER = 'DIGITAL_SIGNATURE_COURIER',
}

export enum FollowUpStatus {
  PENDING = 'PENDING',
  YES_RECEIVED = 'YES_RECEIVED',
  COURIER_DISPATCHED = 'COURIER_DISPATCHED',
  COMPLETED = 'COMPLETED',
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

  @Column({
    type: 'enum',
    enum: FollowUpStatus,
    default: FollowUpStatus.PENDING,
  })
  followUpStatus!: FollowUpStatus;

  @Column({ nullable: true })
  nextFollowUpDate?: Date;

  @Column({ nullable: true })
  remarks?: string;

  // For YES_RECEIVED flows — uploaded file URL
  @Column({ nullable: true })
  documentUrl?: string;

  @Column({ nullable: true })
  documentName?: string;

  // For courier flows
  @Column({ nullable: true })
  courierTrackingNumber?: string;

  @Column({ nullable: true })
  courierProvider?: string;

  @Column({ nullable: true })
  courierDeliveryRemarks?: string;

  @Column({ default: false })
  autoMailSent!: boolean;

  @Column({ default: false })
  isCompleted!: boolean;

  @CreateDateColumn()
  createdDate!: Date;

  @UpdateDateColumn()
  updatedDate!: Date;

  @Column({ default: 'SYSTEM' })
  createdBy!: string;

  @ManyToOne(() => Vendor, (vendor) => vendor.followUps, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'vendorId' })
  vendor!: Vendor;
}
