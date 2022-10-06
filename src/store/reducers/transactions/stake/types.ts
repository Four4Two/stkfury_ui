import {PayloadAction} from "@reduxjs/toolkit";
import { AccountData } from "@cosmjs/launchpad/build/signer";
import { ChainInfo } from "@keplr-wallet/types";
import { OfflineSigner } from "@cosmjs/launchpad";
import { LiquidStakeMsgTypes } from "../../../../helpers/protoMsg";

export interface StakeAmount {
    amount: string,
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
