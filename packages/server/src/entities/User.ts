import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Role } from './Role';

@Entity({ name: 'user' })
@Index(['email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  firstName!: string;

  @Column({ nullable: true })
  middleName?: string;

  @Column()
  lastName!: string;

  @ManyToOne(() => Role, { nullable: false })
  @JoinColumn({ name: 'roleId' })
  role!: Role;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ default: false })
  isDeleted!: boolean;

   @Column({default: "SYSTEM"})
  createdBy!: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdDate!: Date;

  @Column({default:"SYSTEM"})
  updatedBy?: string;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedDate?: Date;
}