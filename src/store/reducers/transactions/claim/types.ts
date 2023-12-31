import { PayloadAction } from "@reduxjs/toolkit";
import { ChainInfo } from "@keplr-wallet/types";
import { OfflineSigner } from "@cosmjs/launchpad";
import { OfflineDirectSigner } from "@cosmjs/proto-signing";

export type claimType = "claimAll" | "claimStkFury";

export interface ClaimState {
  showModal: boolean;
}

export interface ClaimTransactionParams {
  persistenceSigner: OfflineSigner | OfflineDirectSigner;
  persistenceChainInfo: ChainInfo;
  address: string;
  msg: any;
  furyChainInfo: ChainInfo;
  furyAddress: string;
  pollInitialIBCFuryBalance: number;
  claimType: claimType;
}

export type ClaimTransactionPayload = PayloadAction<ClaimTransactionParams>;
