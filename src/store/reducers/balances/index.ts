import { createSlice } from "@reduxjs/toolkit";
import {
  BalanceState,
  FetchBalanceSaga,
  SetFuryBalance,
  SetCosmosBalances,
  SetIbcFuryBalance,
  SetPersistenceBalances,
  SetStkFuryBalance,
  SetXprtBalance
} from "./types";

const initialState: BalanceState = {
  furyBalance: 0,
  stkFuryBalance: 0,
  ibcFuryBalance: 0,
  xprtBalance: 0,
  furyBalances: {
    balances: []
  },
  persistenceBalances: {
    balances: []
  }
};

const balances = createSlice({
  name: "Balance",
  initialState,
  reducers: {
    fetchBalanceSaga: (state, action: FetchBalanceSaga) => {},
    setFuryBalance: (state, action: SetFuryBalance) => {
      state.furyBalance = action.payload;
    },
    setStkFuryBalance: (state, action: SetStkFuryBalance) => {
      state.stkFuryBalance = action.payload;
    },
    setIbcFuryBalance: (state, action: SetIbcFuryBalance) => {
      state.ibcFuryBalance = action.payload;
    },
    setXprtBalance: (state, action: SetXprtBalance) => {
      state.xprtBalance = action.payload;
    },
    setPersistenceBalances: (state, action: SetPersistenceBalances) => {
      state.persistenceBalances = action.payload;
    },
    setCosmosBalances: (state, action: SetCosmosBalances) => {
      state.furyBalances = action.payload;
    }
  }
});

export const {
  setFuryBalance,
  setStkFuryBalance,
  setIbcFuryBalance,
  setXprtBalance,
  fetchBalanceSaga,
  setPersistenceBalances,
  setCosmosBalances
} = balances.actions;

export default balances.reducer;
