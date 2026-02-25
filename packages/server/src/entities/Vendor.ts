import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { VendorTag } from './VendorTag';
import type { VendorContactPerson } from './VendorContactPerson';
import type { VendorDocument } from './VendorDocument';

export enum CompanyType {
  NEW = 'NEW',
  INTERESTED = 'INTERESTED',
  NOT_INTERESTED = 'NOT_INTERESTED',
  FINAL = 'FINAL',
  DELETED = 'DELETED',
}

@Entity({ name: 'vendor' })
export class Vendor {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  type?: string;

  @Column({ type: 'enum', enum: CompanyType, default: CompanyType.NEW })
  status!: CompanyType;

  @Column({ nullable: true })
  gstNumber?: string;

  @Column({ nullable: true })
  panNumber?: string;

  @Column({ nullable: true })
  msmeUdyamNumber?: string;

  @Column({ nullable: true })
  cinNumber?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ default: 'SYSTEM' })
  createdBy!: string;

  @CreateDateColumn()
  createdDate!: Date;

  @Column({ nullable: true })
  updatedBy?: string;

  @UpdateDateColumn()
  updatedDate!: Date;

  @OneToMany('VendorTag', 'vendor', { cascade: true })
  tags!: VendorTag[];

  @OneToMany('VendorContactPerson', 'vendor', { cascade: true })
  contactPersons!: VendorContactPerson[];

  @OneToMany('VendorDocument', 'vendor', { cascade: true })
  documents!: VendorDocument[];
}
