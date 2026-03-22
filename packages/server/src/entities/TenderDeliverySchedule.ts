import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { TenderPostAward } from './TenderPostAward';

export enum DeliveryType {
  ONE_TIME = 'ONE_TIME',
  PARTIAL = 'PARTIAL',
  OPTION_CLAUSE = 'OPTION_CLAUSE',
}

export enum DeliveryScheduleStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  EXTENDED = 'EXTENDED',
}

@Entity({ name: 'tender_delivery_schedule' })
export class TenderDeliverySchedule {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  postAwardId!: string;

  @Column({
    type: 'enum',
    enum: DeliveryType,
    default: DeliveryType.ONE_TIME,
  })
  deliveryType!: DeliveryType;

  @Column({ type: 'timestamp' })
  scheduledDate!: Date;

  @Column({ type: 'float', nullable: true })
  quantity?: number;

  @Column({ type: 'timestamp', nullable: true })
  confirmedDate?: Date;

  @Column({ nullable: true })
  proofUrl?: string;

  @Column({
    type: 'enum',
    enum: DeliveryScheduleStatus,
    default: DeliveryScheduleStatus.PENDING,
  })
  status!: DeliveryScheduleStatus;

  @Column({ default: 'SYSTEM' })
  createdBy!: string;

  @CreateDateColumn()
  createdDate!: Date;

  @Column({ nullable: true })
  updatedBy?: string;

  @UpdateDateColumn()
  updatedDate!: Date;

  @ManyToOne('TenderPostAward', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postAwardId' })
  postAward!: TenderPostAward;
}
