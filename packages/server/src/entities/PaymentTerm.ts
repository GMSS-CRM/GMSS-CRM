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

@Entity({ name: 'payment_term' })
export class PaymentTerm {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  vendorId!: string;

  @Column()
  companyType!: string; // GMSS Vendor or Consulting/Other Party

  @Column()
  paymentTermType!: string; // Advance Payment, Payment Within 30 Days, Payment After 30 Days

  @Column({ nullable: true })
  commissionStructure?: string; // 50% commission on Order and 50% commission on Against payment release, 100% commission on Against Payment release

  @Column({ default: false })
  otherBenefits!: boolean; // Yes or No

  @Column({ nullable: true })
  benefitDetails?: string; // Details of other benefits if otherBenefits is true

  @Column({ nullable: true })
  agreementDate?: Date;

  @Column({ nullable: true })
  fillAmount?: string; // Monthly, Quarterly, Yearly amount details

  @Column({ default: true })
  isActive!: boolean;

  @Column({ default: 'SYSTEM' })
  createdBy!: string;

  @CreateDateColumn()
  createdDate!: Date;

  @Column({ nullable: true })
  updatedBy?: string;

  @UpdateDateColumn()
  updatedDate!: Date;

  /* RELATIONS */

  @ManyToOne(() => Vendor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vendorId' })
  vendor!: Vendor;
}
