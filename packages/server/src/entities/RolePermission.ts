import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Role } from './Role';
import { Permission } from '@gmss/types';

@Entity({ name: 'role_permission' })
@Index(['role', 'permission'], { unique: true })
export class RolePermission {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Role, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roleId' })
  role!: Role;

  @Column({ type: 'varchar' })
  permission!: Permission;

  @Column({ default: 'SYSTEM' })
  createdBy!: string;

  @CreateDateColumn()
  createdDate!: Date;
}
