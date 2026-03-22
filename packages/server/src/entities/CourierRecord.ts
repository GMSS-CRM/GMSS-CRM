import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum CourierDirection {
  INBOUND = 'INBOUND',
  OUTBOUND = 'OUTBOUND',
}

export enum CourierStatus {
  DISPATCHED = 'DISPATCHED',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
}

@Entity({ name: 'courier_record' })
export class CourierRecord {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'enum',
    enum: CourierDirection,
    default: CourierDirection.OUTBOUND,
  })
  direction!: CourierDirection;

  @Column({ nullable: true })
  courierCompany?: string;

  @Column({ nullable: true })
  courierContact?: string;

  @Column({ nullable: true })
  courierEmail?: string;

  @Column({ nullable: true })
  awbNumber?: string;

  @Column({ nullable: true })
  trackingUrl?: string;

  @Column({ nullable: true })
  senderName?: string;

  @Column({ nullable: true })
  receiverName?: string;

  @Column({ type: 'timestamp', nullable: true })
  dispatchDate?: Date;

  @Column({ type: 'timestamp', nullable: true })
  receivedDate?: Date;

  @Column({
    type: 'enum',
    enum: CourierStatus,
    default: CourierStatus.DISPATCHED,
  })
  status!: CourierStatus;

  @Column({ nullable: true })
  receiptProofUrl?: string;

  @Column({ nullable: true })
  referenceId?: string;

  @Column({ nullable: true })
  referenceType?: string; // tender, vendor, postAward, etc.

  @Column({ default: 'SYSTEM' })
  createdBy!: string;

  @CreateDateColumn()
  createdDate!: Date;

  @Column({ nullable: true })
  updatedBy?: string;

  @UpdateDateColumn()
  updatedDate!: Date;
}
