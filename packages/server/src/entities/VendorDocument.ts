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

export enum DocumentType {
  GENERAL = 'GENERAL',
  DIGITAL_SIGNATURE = 'DIGITAL_SIGNATURE',
  GST_CERT = 'GST_CERT',
  PAN_CERT = 'PAN_CERT',
  MSME_CERT = 'MSME_CERT',
  AGREEMENT = 'AGREEMENT',
  OTHER = 'OTHER',
}

@Entity({ name: 'vendor_document' })
export class VendorDocument {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  vendorId!: string;

  @Column()
  documentName!: string;

  @Column()
  documentUrl!: string;

  @Column({
    type: 'enum',
    enum: DocumentType,
    default: DocumentType.GENERAL,
  })
  documentType!: DocumentType;

  @Column({ nullable: true })
  expiresOn?: Date;

  @Column({ default: 'SYSTEM' })
  createdBy!: string;

  @CreateDateColumn()
  createdDate!: Date;

  @Column({ nullable: true })
  updatedBy?: string;

  @UpdateDateColumn()
  updatedDate!: Date;

   @ManyToOne('Vendor', 'documents', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vendorId' })
  vendor!: Vendor;
}
