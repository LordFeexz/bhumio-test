import { DEFAULT_USER_PASSWORD, userRole } from "../../constant/user.constant";
import type { UserRole } from "../../interfaces/user";
import {
  Entity,
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinTable,
} from "typeorm";
import { UserGroup } from "../userGroup/userGroup.entity";

@Entity({ name: "Users" })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column({ nullable: false })
  public name: string;

  @Column({ nullable: false, unique: true })
  public email: string;

  @Column({ default: DEFAULT_USER_PASSWORD })
  public password: string;

  @Column({
    nullable: false,
    enum: userRole,
  })
  public role: UserRole;

  @OneToMany(() => UserGroup, (UserGroup) => UserGroup.userId)
  @JoinTable()
  public userGroup: UserGroup[];

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
