import { PayloadAction } from "@reduxjs/toolkit";
import { ChainInfo } from "@keplr-wallet/types";
import { OfflineSigner } from "@cosmjs/launchpad";
import {
  LiquidStakeMsgTypes,
  TokenizeShareMsgTypes
} from "../../../../helpers/protoMsg";
import { OfflineDirectSigner } from "@cosmjs/proto-signing";

// 0- initialized, 1-depositStart, 2-depositSigned, 3-stakeStart, 4-stakeSigned, 5-complete
export type TransactionSteps = 0 | 1 | 2 | 3 | 4 | 5; // These are txn steps number for easy transaction tracking in ui.

export type StakeOption = "wallet" | "validator";

export type LiquidStakeType =
  | "directStaking"
  | "ibcStaking"
  | "delegationStaking";

export interface DelegatedValidator {
  name: string;
  amount: string;
  identity: string;
  inputAmount: string;
  validatorAddress: string;
  status?: boolean;
}

export interface DelegatedValidators {
  list: DelegatedValidator[];
  totalAmount: number | string;
}

export interface StakeAmount {
  amount: string;
  showModal: boolean;
  txFailed: boolean;
  stepNumber: TransactionSteps;
  liquidStakeType: LiquidStakeType | TokenizeShareMsgTypes;
  stakeOption: StakeOption;
  delegationStakeAmount: string;
  delegatedValidators: DelegatedValidators;
  delegatedValidatorsLoader: boolean;
  validatorModal: boolean;
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
  dstAddress: string;
  dstChainInfo: ChainInfo;
}

export interface fetchDelegatedValidatorsParams {
  address: string;
  rpc: string;
}

export type StakeTransactionPayload = PayloadAction<StakeTransactionParams>;
export type SetStakeAmount = PayloadAction<string>;
export type SetTransactionFailedStatus = PayloadAction<boolean>;
export type SetLiquidStakeType = PayloadAction<LiquidStakeType>;
export type SetTransactionStep = PayloadAction<TransactionSteps>;
export type SetLiquidStakeOption = PayloadAction<StakeOption>;
export type SetValidatorModal = PayloadAction<boolean>;
export type FetchDelegatedValidatorsSaga =
  PayloadAction<fetchDelegatedValidatorsParams>;
export type SetDelegatedValidators = PayloadAction<DelegatedValidators>;
export type SetDelegatedValidatorsLoader = PayloadAction<boolean>;
export type SetDelegationsStakeAmount = PayloadAction<string>;
export type DelegationStakeTransactionPayload =
  PayloadAction<DelegationStakeTransactionParams>;
