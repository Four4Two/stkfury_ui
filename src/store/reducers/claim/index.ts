import { createSlice } from "@reduxjs/toolkit";
import {
  ClaimState,
  SetPendingClaimList,
  SetClaimableBalance,
  FetchPendingClaimSaga,
  SetClaimableStkFuryBalance
} from "./types";

const initialState: ClaimState = {
  pendingClaimList: [],
  claimableBalance: 0,
  claimableStkFuryBalance: 0,
  unlistedPendingClaimList: []
};

const claimQueries = createSlice({
  name: "ClaimQueries",
  initialState,
  reducers: {
    fetchPendingClaimsSaga: (state, action: FetchPendingClaimSaga) => {},
    setPendingClaimList: (state, action: SetPendingClaimList) => {
      state.pendingClaimList = action.payload;
    },
    setUnlistedPendingClaimList: (state, action: SetPendingClaimList) => {
      state.unlistedPendingClaimList = action.payload;
    },
    setClaimableBalance: (state, action: SetClaimableBalance) => {
      state.claimableBalance = action.payload;
    },
    setClaimableStkFuryBalance: (state, action: SetClaimableStkFuryBalance) => {
      state.claimableStkFuryBalance = action.payload;
    }
  }
});

export const {
  fetchPendingClaimsSaga,
  setPendingClaimList,
  setClaimableBalance,
  setClaimableStkFuryBalance,
  setUnlistedPendingClaimList
} = claimQueries.actions;

export default claimQueries.reducer;
