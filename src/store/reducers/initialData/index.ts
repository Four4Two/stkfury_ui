import { createSlice } from "@reduxjs/toolkit";
import {
  SetAtomPrice,
  SetExchangeRate,
  FetchInitialDataSaga,
  InitialDataState,
  SetAPR,
  SetRedeemFee,
    SetTVU
} from "./types";

const initialState: InitialDataState = {
  exchangeRate: 1,
  atomPrice: 0,
  apr: 0,
  redeemFee:0,
  tvu:0
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
    }
  }
});

export const { setRedeemFee, setAPR, setAtomPrice, fetchInitSaga, setExchangeRate,setTVU } =
  initData.actions;

export default initData.reducer;
