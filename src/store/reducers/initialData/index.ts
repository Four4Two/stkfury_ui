import { createSlice } from "@reduxjs/toolkit";
import {
  SetAtomPrice,
  SetExchangeRate,
  FetchInitialDataSaga,
  InitialDataState,
  SetAPR,
  SetRedeemFee,
  SetTVU,
  SetMaxRedeem,
  SetMinRedeem,
  SetChainStatus
} from "./types";
import { MIN_DEPOSIT } from "../../../../AppConstants";

const initialState: InitialDataState = {
  exchangeRate: 1,
  atomPrice: 0,
  apr: 0,
  redeemFee: 0,
  tvu: 0,
  maxRedeem: 0,
  minDeposit: MIN_DEPOSIT,
  cosmosChainStatus: false,
  persistenceChainStatus: false
};

const initData = createSlice({
  name: "InitData",
  initialState,
  reducers: {
    fetchInitSaga: (state, action: FetchInitialDataSaga) => {},
    setExchangeRate: (state, action: SetExchangeRate) => {
      state.exchangeRate = action.payload;
    },
    setAPR: (state, action: SetAPR) => {
      state.apr = action.payload;
    },
    setAtomPrice: (state, action: SetAtomPrice) => {
      state.atomPrice = action.payload;
    },
    setRedeemFee: (state, action: SetRedeemFee) => {
      state.redeemFee = action.payload;
    },
    setTVU: (state, action: SetTVU) => {
      state.tvu = action.payload;
    },
    setMaxRedeem: (state, action: SetMaxRedeem) => {
      state.maxRedeem = action.payload;
    },
    setMinDeposit: (state, action: SetMinRedeem) => {
      state.minDeposit = action.payload;
    },
    setCosmosChainStatus: (state, action: SetChainStatus) => {
      state.cosmosChainStatus = action.payload;
    },
    setPersistenceChainStatus: (state, action: SetChainStatus) => {
      state.persistenceChainStatus = action.payload;
    }
  }
});

export const {
  setRedeemFee,
  setAPR,
  setAtomPrice,
  fetchInitSaga,
  setExchangeRate,
  setTVU,
  setMaxRedeem,
  setMinDeposit,
  setCosmosChainStatus,
  setPersistenceChainStatus
} = initData.actions;

export default initData.reducer;
