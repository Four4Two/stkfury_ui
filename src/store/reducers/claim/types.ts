import { PayloadAction } from "@reduxjs/toolkit";
import { AccountData } from "@cosmjs/launchpad/build/signer";
import { ChainInfo } from "@keplr-wallet/types";

export interface ClaimState {
  pendingClaimList: any[];
  claimableBalance: number;
  claimableStkFuryBalance: number;
  unlistedPendingClaimList: any[];
}

export interface FetchPendingClaimSagaParams {
  persistenceChainInfo: ChainInfo;
  dstChainInfo: ChainInfo;
  address: string;
}

export type SetPendingClaimList = PayloadAction<any[]>;
export type SetClaimableBalance = PayloadAction<number>;
export type SetClaimableStkFuryBalance = PayloadAction<number>;

export type FetchPendingClaimSaga = PayloadAction<FetchPendingClaimSagaParams>;
