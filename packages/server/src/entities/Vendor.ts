import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VendorStatus } from './enums/VendorStatus';
import { VendorWorkflow } from './VendorWorkflow';
import { VendorProposal } from './VendorProposal';
import { VendorAgreement } from './VendorAgreement';
import { VendorFollowUp } from './VendorFollowUp';
import { VendorApproval } from './VendorApproval';
import { VendorTender } from './VendorTender';
import { VendorContactPerson } from './VendorContactPerson';
import { VendorDocument } from './VendorDocument';

@Entity({ name: 'vendor' })
export class Vendor {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string;

  @Column({ nullable: true })
  type?: string; // GMSS Vendor / Consulting

  @Column({
    type: 'enum',
    enum: VendorStatus,
    default: VendorStatus.NEW,
  })
  status!: VendorStatus;

  @Column({ default: false })
  isRailwayLinked!: boolean;

  @Column({ nullable: true })
  gstNumber?: string;

  @Column({ nullable: true })
  panNumber?: string;

  @Column({ nullable: true })
  cinNumber?: string;

  @Column({ nullable: true })
  msmeUdyamNumber?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ default: 'SYSTEM' })
  createdBy!: string;

  @CreateDateColumn()
  createdDate!: Date;

  @Column({ nullable: true })
  updatedBy?: string;

  @UpdateDateColumn()
  updatedDate!: Date;

  @Column({ default: false })
  isDeleted!: boolean;

  @Column({ nullable: true })
  deletedBy?: string;

  @Column({ nullable: true })
  deletedDate?: Date;




  /* RELATIONS */

  @OneToMany(() => VendorWorkflow, (workflow) => workflow.vendor)
  workflows!: VendorWorkflow[];

  @OneToMany(() => VendorApproval, (approval) => approval.vendor)
  approvals!: VendorApproval[];

  @OneToMany(() => VendorProposal, (proposal) => proposal.vendor)
  proposals!: VendorProposal[];

  @OneToMany(() => VendorAgreement, (agreement) => agreement.vendor)
  agreements!: VendorAgreement[];

  @OneToMany(() => VendorFollowUp, (followUp) => followUp.vendor)
  followUps!: VendorFollowUp[];

  @OneToMany(() => VendorTender, (vendorTender) => vendorTender.vendor)
  tenders!: VendorTender[];

  @OneToMany(() => VendorContactPerson, cp => cp.vendor, { cascade: false })
  contactPersons!: VendorContactPerson[];

  @OneToMany(() => VendorDocument, doc => doc.vendor, { cascade: false })
  documents!: VendorDocument[];
}
