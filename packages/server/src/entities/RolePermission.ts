import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { Role } from "./Role";
import { Permission } from "./Permission";

@Entity("role_permissions")
export class RolePermission {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Role, (role) => role.rolePermissions, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "roleId" })
  role!: Role;

  @ManyToOne(() => Permission, (permission) => permission.rolePermissions, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "permissionId" })
  permission!: Permission;

  @Column()
  createdBy!: string;

  @CreateDateColumn()
  createdDate!: Date;

  @Column()
  updatedBy!: string;

  @UpdateDateColumn()
  updatedDate!: Date;
}
