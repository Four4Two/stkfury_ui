import { PayloadAction } from "@reduxjs/toolkit";
import { ChainInfo } from "@keplr-wallet/types";
import { QueryAllBalancesResponse } from "cosmjs-types/cosmos/bank/v1beta1/query";

export interface BalanceState {
  furyBalance: number;
  stkFuryBalance: number;
  ibcFuryBalance: number;
  xprtBalance: number;
  furyBalances: QueryAllBalancesResponse;
  persistenceBalances: QueryAllBalancesResponse;
}

export interface FetchBalanceSagaParams {
  persistenceAddress: string;
  furyAddress: string;
  persistenceChainInfo: ChainInfo;
  furyChainInfo: ChainInfo;
}

export type SetFuryBalance = PayloadAction<number>;
export type SetPersistenceBalances = PayloadAction<QueryAllBalancesResponse>;
export type SetCosmosBalances = PayloadAction<QueryAllBalancesResponse>;
export type SetStkFuryBalance = PayloadAction<number>;
export type SetIbcFuryBalance = PayloadAction<number>;
export type SetXprtBalance = PayloadAction<number>;

export type FetchBalanceSaga = PayloadAction<FetchBalanceSagaParams>;
