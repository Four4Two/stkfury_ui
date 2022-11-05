import { createSlice } from "@reduxjs/toolkit";
import { FEES, POOL_LIQUIDITY } from "../../../../AppConstants";
import {
  SetAtomPrice,
  SetExchangeRate,
  FetchInitialDataSaga,
  InitialDataState,
  SetAPR,
  SetRedeemFee,
  InitialLiquidityFees,
  SetTVU,
  SetMaxRedeem,
  SetMinRedeem,
  SetChainStatus
} from "./types";
import { MIN_DEPOSIT } from "../../../../AppConstants";

const initialLiquidity_Fees: InitialLiquidityFees = {
  [POOL_LIQUIDITY]: 0,
  [FEES]: 0
};

const initialState: InitialDataState = {
  exchangeRate: 1,
  atomPrice: 0,
  apr: 0,
  redeemFee: 0,
  osmosisInfo: initialLiquidity_Fees,
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
    setOsmosisInfo: (state, action) => {
      state.osmosisInfo = action.payload;
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
  setOsmosisInfo,
  setExchangeRate,
  setTVU,
  setMaxRedeem,
  setMinDeposit,
  setCosmosChainStatus,
  setPersistenceChainStatus
} = initData.actions;

export default initData.reducer;
