// src/entities/User.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Role } from "./Role";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  firstName!: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ unique: true })
  email!: string;

  // ✅ REAL COLUMN (IMPORTANT)
  @Column({ type: "uuid" })
  roleId!: string;

  // ✅ VIRTUAL RELATION (no insert/update)
  @ManyToOne(() => Role, { eager: false })
  @JoinColumn({ name: "roleId" })
  role!: Role;

  @Column({ default: "SYSTEM" })
  createdBy!: string;
}
