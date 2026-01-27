import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Vendor } from './Vendor';

@Entity({ name: 'vendor_contact_person' })
export class VendorContactPerson {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne('Vendor', 'contactPersons', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vendorId' })
  vendor!: Vendor;

  @Column()
  vendorId!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  designation?: string;

  @Column()
  phoneNumber!: string;

  @Column()
  email!: string;

  @Column({ nullable: true })
  cc?: string;

  @Column({ nullable: true })
  bcc?: string;

  @Column({ type: 'simple-array', nullable: true })
  tags?: string[];

  @Column({ type: 'simple-array', nullable: true })
  categories?: string[];

  @Column({ default: 'SYSTEM' })
  createdBy!: string;

  @CreateDateColumn()
  createdDate!: Date;

  @Column({ nullable: true })
  updatedBy?: string;

  @UpdateDateColumn()
  updatedDate!: Date;
}
