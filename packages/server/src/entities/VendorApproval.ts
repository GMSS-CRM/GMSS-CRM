import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Vendor } from './Vendor';

export enum ApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity({ name: 'vendor_approval' })
export class VendorApproval {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  vendorId!: string;

  @Column({
    type: 'enum',
    enum: ApprovalStatus,
    default: ApprovalStatus.PENDING,
  })
  status!: ApprovalStatus;

  @Column({ nullable: true })
  remarks?: string;

  @Column({ nullable: true })
  approvedBy?: string;

  @Column({ nullable: true })
  approvedDate?: Date;

  @CreateDateColumn()
  createdDate!: Date;

  @ManyToOne(() => Vendor, (vendor) => vendor.approvals, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'vendorId' })
  vendor!: Vendor;
}
