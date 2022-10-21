import { PayloadAction } from "@reduxjs/toolkit";
import { ChainInfo } from "@keplr-wallet/types";
import { OfflineSigner } from "@cosmjs/launchpad";
import { ClaimMsgTypes } from "../../../../helpers/protoMsg";
import { OfflineDirectSigner } from "@cosmjs/proto-signing";

export interface ClaimState {
  showModal: boolean;
}

export interface ClaimTransactionParams {
  persistenceSigner: OfflineSigner | OfflineDirectSigner;
  persistenceChainInfo: ChainInfo;
  address: string;
  msg: ClaimMsgTypes[];
  cosmosChainInfo: ChainInfo;
  cosmosAddress: string;
  pollInitialIBCAtomBalance: number;
}

export type ClaimTransactionPayload = PayloadAction<ClaimTransactionParams>;
