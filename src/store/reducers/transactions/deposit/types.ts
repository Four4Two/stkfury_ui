import { PayloadAction } from "@reduxjs/toolkit";
import { ChainInfo } from "@keplr-wallet/types";
import { OfflineSigner } from "@cosmjs/launchpad";
import { LiquidStakeMsgTypes } from "../../../../helpers/protoMsg";
import { OfflineDirectSigner } from "@cosmjs/proto-signing";

export interface DepositState {
  amount: string;
  showModal: boolean;
}
export interface DepositTransactionParams {
  furySigner: OfflineSigner | OfflineDirectSigner;
  furyChainInfo: ChainInfo;
  persistenceChainInfo: ChainInfo;
  furyAddress: string;
  persistenceAddress: string;
  depositMsg: LiquidStakeMsgTypes;
  pollInitialDepositBalance: number;
  persistenceSigner: OfflineSigner | OfflineDirectSigner;
  stakeMsg: LiquidStakeMsgTypes;
  pollInitialStakeBalance: number;
}

export type DepositTransactionPayload = PayloadAction<DepositTransactionParams>;
export type SetDepositAmount = PayloadAction<string>;
