import { PayloadAction } from "@reduxjs/toolkit";
import { ChainInfo } from "@keplr-wallet/types";

export interface InitialDataState {
  atomPrice: number;
  cosmosChainStatus: boolean;
  persistenceChainStatus: boolean;
}

export interface FetchLiveDataSagaParams {
  persistenceChainInfo: ChainInfo;
  cosmosChainInfo: ChainInfo;
}

export type SetAtomPrice = PayloadAction<number>;
export type SetChainStatus = PayloadAction<boolean>;

export type FetchLiveDataSaga = PayloadAction<FetchLiveDataSagaParams>;
