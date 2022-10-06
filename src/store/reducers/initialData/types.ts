import { PayloadAction } from "@reduxjs/toolkit";
import { ChainInfo } from "@keplr-wallet/types";

export interface InitialDataState {
  exchangeRate: number;
  atomPrice: number;
  apr: number;
}

export interface FetchInitialDataSagaParams {
  persistenceChainInfo: ChainInfo;
}

export type SetExchangeRate = PayloadAction<number>;
export type SetAPR = PayloadAction<number>;
export type SetAtomPrice = PayloadAction<number>;

export type FetchInitialDataSaga = PayloadAction<FetchInitialDataSagaParams>;
