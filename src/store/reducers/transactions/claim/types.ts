import {PayloadAction} from "@reduxjs/toolkit";
import { ChainInfo } from "@keplr-wallet/types";
import { OfflineSigner } from "@cosmjs/launchpad";
import { ClaimMsgTypes } from "../../../../helpers/protoMsg";

export interface ClaimState {
    showModal: boolean
}

export interface ClaimTransactionParams {
    persistenceSigner : OfflineSigner,
    persistenceChainInfo: ChainInfo,
    address:string,
    msg:ClaimMsgTypes
}

export type ClaimTransactionPayload = PayloadAction<ClaimTransactionParams>
