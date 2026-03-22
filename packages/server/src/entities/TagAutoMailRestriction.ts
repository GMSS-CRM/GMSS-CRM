import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import type { Tag } from './Tag';
import type { Vendor } from './Vendor';

@Entity({ name: 'tag_auto_mail_restriction' })
@Unique(['tagId', 'vendorId'])
export class TagAutoMailRestriction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  tagId!: string;

  @Column()
  vendorId!: string;

  @Column({ default: 'SYSTEM' })
  createdBy!: string;

  @CreateDateColumn()
  createdDate!: Date;

  @ManyToOne('Tag', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tagId' })
  tag!: Tag;

  @ManyToOne('Vendor', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vendorId' })
  vendor!: Vendor;
}
