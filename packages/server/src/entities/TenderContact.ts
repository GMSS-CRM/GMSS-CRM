import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Tender } from './Tender';

export enum TenderContactType {
  DEPARTMENT = 'DEPARTMENT',
  OFFICER = 'OFFICER',
  CONSIGNEE = 'CONSIGNEE',
  ACCOUNTS_OFFICER = 'ACCOUNTS_OFFICER',
  SD_OFFICER = 'SD_OFFICER',
}

@Entity({ name: 'tender_contact' })
export class TenderContact {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  tenderId!: string;

  @Column({
    type: 'enum',
    enum: TenderContactType,
    default: TenderContactType.OFFICER,
  })
  contactType!: TenderContactType;

  @Column()
  name!: string;

  @Column({ nullable: true })
  designation?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  email?: string;

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

  @ManyToOne('Tender', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenderId' })
  tender!: Tender;
}
