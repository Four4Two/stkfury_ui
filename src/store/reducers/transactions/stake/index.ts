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
  TokenizedShareStakeTransactionPayload,
  SetTokenizeSharesLoader,
  SetTransactionFailedResponse
} from "./types";

const initialState: StakeAmount = {
  amount: "",
  showModal: false,
  txFailed: false,
  stepNumber: 0,
  liquidStakeType: "directStaking",
  stakeOption: "wallet",
  validatorModal: false,
  txFailedResponse: "",
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
  tokenizedModal: false,
  tokenizeSharesLoader: false
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
    setStakeTxnFailedResponse: (
      state,
      { payload }: SetTransactionFailedResponse
    ) => {
      state.txFailedResponse = payload;
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
    setTokenizeSharesLoader: (state, { payload }: SetTokenizeSharesLoader) => {
      state.tokenizeSharesLoader = payload;
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
  setStakeTxnFailedResponse,
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
  executeTokenizedShareStakeTransactionSaga,
  setTokenizeSharesLoader
} = stake.actions;

export default stake.reducer;
