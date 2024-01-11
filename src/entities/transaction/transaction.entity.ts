import {
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
} from "../../constant/transaction.constant";
import type {
  TransactionStatus,
  TransactionType,
} from "../../interfaces/transaction";
import {
  Entity,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "../user/user.entity";

@Entity({ name: "Transactions" })
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column({ nullable: false, enum: TRANSACTION_TYPE })
  public type: TransactionType;

  @Column({ enum: TRANSACTION_STATUS, default: "Process" })
  public status: TransactionStatus;

  @Column({ nullable: false })
  userId: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: "userId" })
  user: User;

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
