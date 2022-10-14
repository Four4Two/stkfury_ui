import {PayloadAction} from "@reduxjs/toolkit";
import { ChainInfo } from "@keplr-wallet/types";
import { OfflineSigner } from "@cosmjs/launchpad";
import { LiquidStakeMsgTypes } from "../../../../helpers/protoMsg";

export interface WithdrawState {
    amount: string,
    showModal: boolean,
    txFailed: boolean,
    stepNumber: number
}

export interface WithdrawTransactionParams {
    cosmosChainInfo: ChainInfo,
    persistenceChainInfo: ChainInfo,
    cosmosAddress:string,
    persistenceAddress:string,
    withdrawMsg:LiquidStakeMsgTypes,
    pollInitialIBCAtomBalance:number,
    persistenceSigner : OfflineSigner,
}

export type WithdrawTransactionPayload = PayloadAction<WithdrawTransactionParams>