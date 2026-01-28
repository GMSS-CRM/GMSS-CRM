import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Tender } from './Tender';
import { Tag } from './Tag';

@Entity({ name: 'tender_tag' })
export class TenderTag {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  tenderId!: string;

  @Column()
  tagId!: string;

  @ManyToOne(() => Tender, (tender) => tender.tags, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenderId' })
  tender!: Tender;

  @ManyToOne(() => Tag, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tagId' })
  tag!: Tag;
}
