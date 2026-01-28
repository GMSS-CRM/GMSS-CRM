import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Tender } from './Tender';

@Entity({ name: 'tender_document' })
export class TenderDocument {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  tenderId!: string;

  @Column()
  documentName!: string;

  @Column()
  documentUrl!: string;

  @Column({ nullable: true })
  expiresOn?: Date;

  @Column({ default: 'SYSTEM' })
  createdBy!: string;

  @CreateDateColumn()
  createdDate!: Date;
  
  @ManyToOne(() => Tender, (tender) => tender.documents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenderId' })
  tender!: Tender;
}
