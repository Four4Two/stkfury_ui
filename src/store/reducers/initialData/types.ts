import { PayloadAction } from "@reduxjs/toolkit";
import { ChainInfo } from "@keplr-wallet/types";
import { FEES, POOL_LIQUIDITY } from "../../../../AppConstants";

export interface InitialLiquidityFees {
  [POOL_LIQUIDITY]: number;
  [FEES]: number;
}

export interface InitialDataState {
  exchangeRate: number;
  atomPrice: number;
  apr: number;
  redeemFee: number;
  osmosisInfo: InitialLiquidityFees;
  tvu: number;
}

export interface FetchInitialDataSagaParams {
  persistenceChainInfo: ChainInfo;
}

export type SetExchangeRate = PayloadAction<number>;
export type SetAPR = PayloadAction<number>;
export type SetAtomPrice = PayloadAction<number>;
export type SetRedeemFee = PayloadAction<number>;
export type SetTVU = PayloadAction<number>;

export type FetchInitialDataSaga = PayloadAction<FetchInitialDataSagaParams>;
