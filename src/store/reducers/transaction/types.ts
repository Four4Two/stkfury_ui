import {PayloadAction} from "@reduxjs/toolkit";
import { ChainInfo } from "@keplr-wallet/types";
import { LiquidStakeMsgTypes } from "../../../helpers/protoMsg";
export type TransactionType = "stake" | "unstake" | "claim" | "deposit" | "withdraw" | ""

export interface TransactionState {
    inProgress: boolean,
    name: TransactionType
}

export type TransactionPayload = PayloadAction<TransactionType>