import {PayloadAction} from "@reduxjs/toolkit";
import { AccountData } from "@cosmjs/launchpad/build/signer";
import { ChainInfo } from "@keplr-wallet/types";
import { OfflineSigner } from "@cosmjs/launchpad";
import { LiquidStakeMsgTypes } from "../../../../helpers/protoMsg";

// 0- initialized, 1-depositStart, 2-depositSigned, 3-stakeStart, 4-stakeSigned, 5-complete
export type TransactionSteps = 0 | 1 | 2 | 3 | 4 | 5 // These are txn steps number for easy transaction tracking in ui.

export interface StakeAmount {
    amount: string,
    showModal: boolean,
    txFailed: boolean,
    stepNumber: TransactionSteps
}

export interface StakeTransactionParams {
    persistenceSigner : OfflineSigner,
    persistenceChainInfo: ChainInfo,
    account:string,
    msg:LiquidStakeMsgTypes,
    pollInitialBalance:number
}

export type StakeTransactionPayload = PayloadAction<StakeTransactionParams>
export type SetStakeAmount = PayloadAction<string>
export type SetTransactionFailedStatus = PayloadAction<boolean>
export type SetTransactionStep = PayloadAction<TransactionSteps>