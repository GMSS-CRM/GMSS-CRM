import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { RolePermission } from "./RolePermission";

@Entity("permissions")
export class Permission {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  createdBy!: string;

  @CreateDateColumn()
  createdDate!: Date;

  @Column()
  updatedBy!: string;
  
  @UpdateDateColumn()
  updatedDate!: Date;

  // ✅ Optional mapping
  @OneToMany(() => RolePermission, (rp) => rp.permission, { nullable: true })
  rolePermissions?: RolePermission[];
}
