import {PayloadAction} from "@reduxjs/toolkit";
import { ChainInfo } from "@keplr-wallet/types";
import { OfflineSigner } from "@cosmjs/launchpad";
import { ClaimMsgTypes } from "../../../../helpers/protoMsg";

export interface ClaimTransactionParams {
    persistenceSigner : OfflineSigner,
    persistenceChainInfo: ChainInfo,
    account:string,
    msg:ClaimMsgTypes
}

export type ClaimTransactionPayload = PayloadAction<ClaimTransactionParams>
