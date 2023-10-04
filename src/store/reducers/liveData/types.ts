import { PayloadAction } from "@reduxjs/toolkit";
import { ChainInfo } from "@keplr-wallet/types";

export interface InitialDataState {
  furyPrice: number;
  tvu: number;
  furyChainStatus: boolean;
  persistenceChainStatus: boolean;
}

export interface FetchLiveDataSagaParams {
  persistenceChainInfo: ChainInfo;
  furyChainInfo: ChainInfo;
}

export type SetFuryPrice = PayloadAction<number>;
export type SetChainStatus = PayloadAction<boolean>;
export type SetTVU = PayloadAction<number>;
export type FetchLiveDataSaga = PayloadAction<FetchLiveDataSagaParams>;
