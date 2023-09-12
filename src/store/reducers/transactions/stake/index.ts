import { createSlice } from "@reduxjs/toolkit";
import {
  SetStakeAmount,
  StakeAmount,
  StakeTransactionPayload,
  SetTransactionFailedStatus,
  SetTransactionStep,
  SetLiquidStakeType,
  FetchDelegatedValidatorsSaga,
  FetchTokenizeSharesSaga,
  SetDelegatedValidators,
  SetDelegatedValidatorsLoader,
  SetDelegationsStakeAmount,
  SetValidatorModal,
  SetLiquidStakeOption,
  DelegationStakeTransactionPayload,
  SetTokenizedShares,
  SetTokenizedShareModal,
  TokenizedShareStakeTransactionPayload
} from "./types";

const initialState: StakeAmount = {
  amount: "",
  showModal: false,
  txFailed: false,
  stepNumber: 0,
  liquidStakeType: "directStaking",
  stakeOption: "wallet",
  validatorModal: false,
  delegationStakeAmount: "",
  delegatedValidators: {
    list: [],
    eligible: [],
    nonEligible: [],
    totalAmount: 0
  },
  delegatedValidatorsLoader: false,
  tokenizedShares: {
    sharesOnSourceChain: {
      list: [],
      totalAmount: 0
    },
    sharesOnDestinationChain: {
      list: [],
      totalAmount: 0
    }
  },
  tokenizedModal: false
};

const stake = createSlice({
  name: "Stake",
  initialState,
  reducers: {
    executeStakeTransactionSaga: (state, action: StakeTransactionPayload) => {},
    executeDelegationStakeTransactionSaga: (
      state,
      action: DelegationStakeTransactionPayload
    ) => {},
    executeTokenizedShareStakeTransactionSaga: (
      state,
      action: TokenizedShareStakeTransactionPayload
    ) => {},
    setStakeAmount: (state, { payload }: SetStakeAmount) => {
      state.amount = payload;
    },
    hideStakeModal: (state) => {
      state.showModal = false;
    },
    showStakeModal: (state) => {
      state.showModal = true;
    },
    setStakeTxnFailed: (state, { payload }: SetTransactionFailedStatus) => {
      state.txFailed = payload;
    },
    setStakeTxnStepNumber: (state, { payload }: SetTransactionStep) => {
      state.stepNumber = payload;
    },
    setLiquidStakeTxnType: (state, { payload }: SetLiquidStakeType) => {
      state.liquidStakeType = payload;
    },
    setLiquidStakeOption: (state, { payload }: SetLiquidStakeOption) => {
      state.stakeOption = payload;
    },
    setValidatorModal: (state, { payload }: SetValidatorModal) => {
      state.validatorModal = payload;
    },
    setTokenizedShareModal: (state, { payload }: SetTokenizedShareModal) => {
      state.tokenizedModal = payload;
    },
    fetchDelegatedValidatorsSaga: (
      state,
      action: FetchDelegatedValidatorsSaga
    ) => {},
    setDelegatedValidators: (state, { payload }: SetDelegatedValidators) => {
      state.delegatedValidators = payload;
    },
    setDelegationsStakeAmount: (
      state,
      { payload }: SetDelegationsStakeAmount
    ) => {
      state.delegationStakeAmount = payload;
    },
    setDelegatedValidatorsLoader: (
      state,
      { payload }: SetDelegatedValidatorsLoader
    ) => {
      state.delegatedValidatorsLoader = payload;
    },
    fetchTokenizeSharesSaga: (state, action: FetchTokenizeSharesSaga) => {},
    setTokenizedShares: (state, { payload }: SetTokenizedShares) => {
      state.tokenizedShares = payload;
    }
  }
});

export const {
  setStakeAmount,
  executeStakeTransactionSaga,
  hideStakeModal,
  showStakeModal,
  setStakeTxnFailed,
  setStakeTxnStepNumber,
  setLiquidStakeTxnType,
  setValidatorModal,
  setDelegatedValidators,
  fetchDelegatedValidatorsSaga,
  setDelegatedValidatorsLoader,
  setDelegationsStakeAmount,
  setLiquidStakeOption,
  executeDelegationStakeTransactionSaga,
  fetchTokenizeSharesSaga,
  setTokenizedShares,
  setTokenizedShareModal,
  executeTokenizedShareStakeTransactionSaga
} = stake.actions;

export default stake.reducer;
