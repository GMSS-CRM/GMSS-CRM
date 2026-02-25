import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Vendor } from './Vendor';

export enum ProposalStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  PENDING_RESPONSE = 'PENDING_RESPONSE',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

@Entity({ name: 'vendor_proposal' })
export class VendorProposal {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  vendorId!: string;

  @Column({
    type: 'enum',
    enum: ProposalStatus,
    default: ProposalStatus.DRAFT,
  })
  status!: ProposalStatus;

  @Column({ nullable: true })
  sentDate?: Date;

  @Column({ nullable: true })
  followUpDate?: Date;

  @Column({ nullable: true })
  remarks?: string;

  @CreateDateColumn()
  createdDate!: Date;

  @ManyToOne(() => Vendor, (vendor) => vendor.proposals, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'vendorId' })
  vendor!: Vendor;
}
