import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { TenderDocument } from './TenderDocument';
import type { TenderTag } from './TenderTag';

@Entity({ name: 'tender' })
export class Tender {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ default: 'SYSTEM' })
  createdBy!: string;

  @Column({ nullable: true })
  updatedBy?: string;

  @CreateDateColumn()
  createdDate!: Date;

  @UpdateDateColumn()
  updatedDate!: Date;

  @OneToMany('TenderDocument', 'tender', { cascade: true })
  documents!: TenderDocument[];

  @OneToMany('TenderTag', 'tender', { cascade: true })
  tags!: TenderTag[];
}
