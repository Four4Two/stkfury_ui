import { PayloadAction } from "@reduxjs/toolkit";
import { ChainInfo } from "@keplr-wallet/types";
import { QueryAllBalancesResponse } from "cosmjs-types/cosmos/bank/v1beta1/query";

export interface BalanceState {
  atomBalance: number;
  stkAtomBalance: number;
  ibcAtomBalance: number;
  xprtBalance: number;
  cosmosBalances: QueryAllBalancesResponse;
  persistenceBalances: QueryAllBalancesResponse;
}

export interface FetchBalanceSagaParams {
  persistenceAddress: string;
  cosmosAddress: string;
  persistenceChainInfo: ChainInfo;
  cosmosChainInfo: ChainInfo;
}

export type SetAtomBalance = PayloadAction<number>;
export type SetPersistenceBalances = PayloadAction<QueryAllBalancesResponse>;
export type SetCosmosBalances = PayloadAction<QueryAllBalancesResponse>;
export type SetStkAtomBalance = PayloadAction<number>;
export type SetIbcAtomBalance = PayloadAction<number>;
export type SetXprtBalance = PayloadAction<number>;

export type FetchBalanceSaga = PayloadAction<FetchBalanceSagaParams>;
