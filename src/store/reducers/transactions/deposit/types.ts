import {PayloadAction} from "@reduxjs/toolkit";
import { AccountData } from "@cosmjs/launchpad/build/signer";
import { ChainInfo } from "@keplr-wallet/types";
import { OfflineSigner } from "@cosmjs/launchpad";
import { LiquidStakeMsgTypes } from "../../../../helpers/protoMsg";

export interface DepositState {
    amount: string,
    showModal: boolean
}
export interface DepositTransactionParams {
    cosmosSigner : OfflineSigner,
    cosmosChainInfo: ChainInfo,
    persistenceChainInfo: ChainInfo,
    cosmosAddress:string,
    persistenceAddress:string,
    msg:LiquidStakeMsgTypes
}

export type DepositTransactionPayload = PayloadAction<DepositTransactionParams>
export type SetDepositAmount = PayloadAction<string>
