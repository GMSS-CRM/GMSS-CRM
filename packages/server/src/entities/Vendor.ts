import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VendorTag } from './VendorTag';
import { VendorContactPerson } from './VendorContactPerson';
import { VendorDocument } from './VendorDocument';

export enum VendorType {
  VENDOR = 'Vendor',
  CONSULTANT = 'Consultant',
}

export enum VendorStatus {
  APPROVED = 'Approved',
  DRAFT = 'Draft',
  SUBMITTED = 'Submitted',
  REJECTED = 'Rejected',
}

@Entity({ name: 'vendor' })
export class Vendor {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'enum', enum: VendorType, default: VendorType.VENDOR })
  type!: VendorType;

  @Column({ type: 'enum', enum: VendorStatus, default: VendorStatus.DRAFT })
  status!: VendorStatus;

  @Column({ nullable: true })
  gstNumber?: string;

  @Column({ nullable: true })
  panNumber?: string;

  @Column({ nullable: true })
  msmeUdyamNumber?: string;

  @Column({ nullable: true })
  cinNumber?: string;

  @Column({ default: 'SYSTEM' })
  createdBy!: string;

  @CreateDateColumn()
  createdDate!: Date;

  @Column({ nullable: true })
  updatedBy?: string;

  @UpdateDateColumn()
  updatedDate!: Date;

  @OneToMany(() => VendorTag, (vendorTag) => vendorTag.vendor, { cascade: true })
  tags!: VendorTag[];

  @OneToMany(() => VendorContactPerson, (contact) => contact.vendor, { cascade: true })
  contactPersons!: VendorContactPerson[];

  @OneToMany(() => VendorDocument, (doc) => doc.vendor, { cascade: true })
  documents!: VendorDocument[];
}
