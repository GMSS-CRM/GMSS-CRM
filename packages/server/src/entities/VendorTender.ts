import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Vendor } from './Vendor';
import { Tender } from './Tender';

export enum ParticipationStatus {
  PENDING = 'PENDING',
  PARTICIPATED = 'PARTICIPATED',
  REJECTED = 'REJECTED',
}

@Entity({ name: 'vendor_tender' })
export class VendorTender {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  vendorId!: string;

  @Column()
  tenderId!: string;

  @Column({ nullable: true })
  sharedDate?: Date;

  @Column({ default: false })
  isParticipating!: boolean;

  @Column({
    type: 'enum',
    enum: ParticipationStatus,
    default: ParticipationStatus.PENDING,
  })
  participationStatus!: ParticipationStatus;


  @CreateDateColumn()
  createdDate!: Date;

  @ManyToOne(() => Vendor, (vendor) => vendor.tenders, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'vendorId' })
  vendor!: Vendor;

  @ManyToOne(() => Tender, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tenderId' })
  tender!: Tender;
}
