export type TransactionType = "Purchase" | "Top Up";

export type TransactionStatus = "Cancel" | "Success" | "Process";

export interface TransactionAttributes {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  createdAt: Date;
  updatedAt: Date;
}
