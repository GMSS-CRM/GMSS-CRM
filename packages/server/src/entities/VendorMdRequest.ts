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

@Entity({ name: 'vendor_md_request' })
export class VendorMdRequest {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  vendorId!: string;

  @Column()
  empId!: string;

  @Column({ type: 'text', nullable: true })
  empRemark?: string;

  @Column({ nullable: true })
  mdId?: string;

  @Column({ type: 'text', nullable: true })
  mdRemark?: string;

  @Column({ default: false })
  isResolved!: boolean;

  @CreateDateColumn()
  createdDate!: Date;

  @UpdateDateColumn()
  updatedDate!: Date;

  @ManyToOne(() => Vendor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vendorId' })
  vendor!: Vendor;
}
