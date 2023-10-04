import { PayloadAction } from "@reduxjs/toolkit";
import { ChainInfo } from "@keplr-wallet/types";
import { OfflineSigner } from "@cosmjs/launchpad";
import { LiquidStakeMsgTypes } from "../../../../helpers/protoMsg";
import { TransactionSteps } from "../stake/types";
import { OfflineDirectSigner } from "@cosmjs/proto-signing";

export interface WithdrawState {
  amount: number;
  showModal: boolean;
  txFailed: boolean;
  stepNumber: number;
}

export interface WithdrawTransactionParams {
  furyChainInfo: ChainInfo;
  persistenceChainInfo: ChainInfo;
  furyAddress: string;
  persistenceAddress: string;
  withdrawMsg: LiquidStakeMsgTypes;
  pollInitialIBCFuryBalance: number;
  persistenceSigner: OfflineSigner | OfflineDirectSigner;
}

export type SetWithdrawAmount = PayloadAction<number>;
export type WithdrawTransactionPayload =
  PayloadAction<WithdrawTransactionParams>;
export type SetTransactionFailedStatus = PayloadAction<boolean>;
export type SetTransactionStep = PayloadAction<TransactionSteps>;
