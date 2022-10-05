import {PayloadAction} from "@reduxjs/toolkit";
import { ChainInfo } from "@keplr-wallet/types";
import { OfflineSigner } from "@cosmjs/launchpad";
import { LiquidStakeMsgTypes } from "../../../../helpers/protoMsg";

export type unStakeType = "instant" | "normal"

export interface UnStakeAmount {
    amount: string,
    type: unStakeType
}

export interface UnStakeTransactionParams {
    persistenceSigner : OfflineSigner,
    persistenceChainInfo: ChainInfo,
    address:string,
    msg:LiquidStakeMsgTypes
}

export type UnStakeTransactionPayload = PayloadAction<UnStakeTransactionParams>
export type SetUnStakeAmount = PayloadAction<string>
export type SetUnStakeOption = PayloadAction<unStakeType>