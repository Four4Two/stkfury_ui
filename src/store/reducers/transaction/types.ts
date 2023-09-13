import { PayloadAction } from "@reduxjs/toolkit";
export type TransactionType =
  | "stake"
  | "unstake"
  | "claim"
  | "deposit"
  | "withdraw"
  | "delegationStaking"
  | "tokenizedSharesStaking"
  | "";

export interface TransactionState {
  inProgress: boolean;
  name: TransactionType;
}

export type TransactionPayload = PayloadAction<TransactionType>;
