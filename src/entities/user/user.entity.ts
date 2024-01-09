import { userRole } from "../../constant/user.constant";
import type { UserRole } from "../../interfaces/user";
import {
  Entity,
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "Users" })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column({ nullable: false })
  public name: string;

  @Column({ nullable: false, unique: true })
  public email: string;

  @Column({ default: "@Test123", select: false })
  public password: string;

  @Column({
    nullable: false,
    enum: userRole,
  })
  public role: UserRole;

  @CreateDateColumn({
    name: "createdAt",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: "updatedAt",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;
}
