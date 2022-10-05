import { createSlice } from "@reduxjs/toolkit";
import {
  SetAtomPrice,
  SetExchangeRate,
  FetchInitialDataSaga,
  InitialDataState,
  SetAPR
} from "./types";

const initialState: InitialDataState = {
  exchangeRate: 1,
  atomPrice: 0,
  apr: 0
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
    }
  }
});

export const { setAPR, setAtomPrice, fetchInitSaga, setExchangeRate } =
  initData.actions;

export default initData.reducer;
