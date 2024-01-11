import { Repository } from "typeorm";
import { Transaction } from "./transaction.entity";

export class TransactionRepository extends Repository<Transaction> {}
