import { PayloadAction } from "@reduxjs/toolkit";
import { ChainInfo } from "@keplr-wallet/types";

export interface BalanceState {
  atomBalance: number;
  stkAtomBalance: number;
  ibcAtomBalance: number;
  xprtBalance: number;
  cosmosBalances: any[];
  persistenceBalances: any[];
}

export interface FetchBalanceSagaParams {
  persistenceAddress: string;
  cosmosAddress: string;
  persistenceChainInfo: ChainInfo;
  cosmosChainInfo: ChainInfo;
}

export type SetAtomBalance = PayloadAction<number>;
export type SetPersistenceBalances = PayloadAction<any[]>;
export type SetCosmosBalances = PayloadAction<any[]>;
export type SetStkAtomBalance = PayloadAction<number>;
export type SetIbcAtomBalance = PayloadAction<number>;
export type SetXprtBalance = PayloadAction<number>;

export type FetchBalanceSaga = PayloadAction<FetchBalanceSagaParams>;
