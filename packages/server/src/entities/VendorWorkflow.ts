import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Vendor } from './Vendor';
import { VendorStatus } from './enums/VendorStatus';

@Entity({ name: 'vendor_workflow' })
export class VendorWorkflow {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  vendorId!: string;

  @Column({
    type: 'enum',
    enum: VendorStatus,
  })
  fromStatus!: VendorStatus;

  @Column({
    type: 'enum',
    enum: VendorStatus,
  })
  toStatus!: VendorStatus;

  @Column({ nullable: true })
  remarks?: string;

  @Column()
  changedBy!: string;

  @CreateDateColumn()
  changedAt!: Date;

  @ManyToOne(() => Vendor, (vendor) => vendor.workflows, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'vendorId' })
  vendor!: Vendor;
}
