import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm';
import type { Vendor } from './Vendor';
import { Tag } from './Tag';

@Entity({ name: 'vendor_tag' })
export class VendorTag {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    vendorId!: string;

    @Column()
    tagId!: string;

    @Column({ default: true })
    sentMail!: boolean;

    @Column({ default: 'SYSTEM' })
    createdBy!: string;

    @CreateDateColumn()
    createdDate!: Date;

    @ManyToOne(() => Tag, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'tagId' })
    tag!: Tag;

    @ManyToOne('Vendor', 'tags', { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'vendorId' })
    vendor!: Vendor;
}
