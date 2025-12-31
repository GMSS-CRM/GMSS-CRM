import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Role } from "./Role";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  firstName!: string;

  @Column({ nullable: true })
  middleName?: string;

  // ✅ Nullable as per review
  @Column({ nullable: true })
  lastName?: string;

  @ManyToOne(() => Role)
  @JoinColumn({ name: "roleId" })
  role!: Role;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ default: false })
  isDeleted!: boolean;

  @Column()
  createdBy!: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdDate!: Date;

  @Column()
  updatedBy!: string;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedDate!: Date;
}
