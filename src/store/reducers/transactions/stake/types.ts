import { PayloadAction } from "@reduxjs/toolkit";
import { ChainInfo } from "@keplr-wallet/types";
import { OfflineSigner } from "@cosmjs/launchpad";
import {
  LiquidStakeMsgTypes,
  TokenizeShareMsgTypes
} from "../../../../helpers/protoMsg";
import { OfflineDirectSigner } from "@cosmjs/proto-signing";
import { Validator as PstakeValidator } from "persistenceonejs/pstake/liquidstakeibc/v1beta1/liquidstakeibc";
import { QueryAllBalancesResponse } from "cosmjs-types/cosmos/bank/v1beta1/query";

// 0- initialized, 1-depositStart, 2-depositSigned, 3-stakeStart, 4-stakeSigned, 5-complete
export type TransactionSteps = 0 | 1 | 2 | 3 | 4 | 5; // These are txn steps number for easy transaction tracking in ui.

export type StakeOption = "wallet" | "validator";

export type DelegatedValidatorStatus = "not-eligible" | "inactive" | "active";

export type LiquidStakeType =
  | "directStaking"
  | "ibcStaking"
  | "delegationStaking"
  | "tokenizedSharesStaking";

export interface DelegatedValidator {
  name: string;
  amount: string;
  identity: string;
  inputAmount: string;
  validatorAddress: string;
  status?: DelegatedValidatorStatus;
}

export interface DelegatedValidators {
  list: DelegatedValidator[];
  eligible: DelegatedValidator[];
  nonEligible: DelegatedValidator[];
  totalAmount: number | string;
}

export interface TokenizedShares {
  sharesOnSourceChain: {
    list: any[];
    totalAmount: number | string;
  };
  sharesOnDestinationChain: {
    list: any[];
    totalAmount: number | string;
  };
}

export interface StakeAmount {
  amount: string;
  showModal: boolean;
  txFailed: boolean;
  txFailedResponse: any;
  stepNumber: TransactionSteps;
  liquidStakeType: LiquidStakeType | TokenizeShareMsgTypes;
  stakeOption: StakeOption;
  delegationStakeAmount: string;
  delegatedValidators: DelegatedValidators;
  delegatedValidatorsLoader: boolean;
  tokenizeSharesLoader: boolean;
  validatorModal: boolean;
  tokenizedShares: TokenizedShares;
  tokenizedModal: boolean;
}

export interface StakeTransactionParams {
  persistenceSigner: OfflineSigner | OfflineDirectSigner;
  persistenceChainInfo: ChainInfo;
  account: string;
  msg: LiquidStakeMsgTypes;
  pollInitialBalance: number;
  cosmosAddress: string;
  cosmosChainInfo: ChainInfo;
}

export interface DelegationStakeTransactionParams {
  srcChainSigner: OfflineSigner | OfflineDirectSigner;
  dstChainSigner: OfflineSigner | OfflineDirectSigner;
  srcChainInfo: ChainInfo;
  account: string;
  msg: TokenizeShareMsgTypes[];
  pollInitialBalance: number;
  initialCosmosBalance: QueryAllBalancesResponse;
  initialPersistenceBalance: QueryAllBalancesResponse;
  dstAddress: string;
  dstChainInfo: ChainInfo;
}

export interface TokenizedShareStakeTransactionParams {
  srcChainSigner: OfflineSigner | OfflineDirectSigner;
  dstChainSigner: OfflineSigner | OfflineDirectSigner;
  srcChainInfo: ChainInfo;
  account: string;
  pollInitialBalance: number;
  dstAddress: string;
  tokenList: TokenizedShares;
  dstChainInfo: ChainInfo;
}

export interface fetchTokenizeSharesSagaParams {
  address: string;
  dstAddress: string;
  srcChain: ChainInfo;
  dstChain: ChainInfo;
  srcChainBalances: any;
  dstChainBalances: any;
}

export interface fetchDelegatedValidatorsParams {
  address: string;
  rpc: string;
  validators: PstakeValidator[];
}

export type StakeTransactionPayload = PayloadAction<StakeTransactionParams>;
export type SetStakeAmount = PayloadAction<string>;
export type SetTransactionFailedStatus = PayloadAction<boolean>;
export type SetTransactionFailedResponse = PayloadAction<any>;
export type SetLiquidStakeType = PayloadAction<LiquidStakeType>;
export type SetTransactionStep = PayloadAction<TransactionSteps>;
export type SetLiquidStakeOption = PayloadAction<StakeOption>;
export type SetValidatorModal = PayloadAction<boolean>;
export type SetTokenizedShareModal = PayloadAction<boolean>;
export type FetchDelegatedValidatorsSaga =
  PayloadAction<fetchDelegatedValidatorsParams>;
export type SetDelegatedValidators = PayloadAction<DelegatedValidators>;
export type SetDelegatedValidatorsLoader = PayloadAction<boolean>;
export type SetTokenizeSharesLoader = PayloadAction<boolean>;
export type SetDelegationsStakeAmount = PayloadAction<string>;
export type DelegationStakeTransactionPayload =
  PayloadAction<DelegationStakeTransactionParams>;
export type TokenizedShareStakeTransactionPayload =
  PayloadAction<TokenizedShareStakeTransactionParams>;
export type FetchTokenizeSharesSaga =
  PayloadAction<fetchTokenizeSharesSagaParams>;
export type SetTokenizedShares = PayloadAction<TokenizedShares>;
