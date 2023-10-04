import { createSlice } from "@reduxjs/toolkit";
import {
  SetFuryPrice,
  FetchLiveDataSaga,
  InitialDataState,
  SetChainStatus,
  SetTVU
} from "./types";

const initialState: InitialDataState = {
  furyPrice: 0,
  tvu: 0,
  furyChainStatus: false,
  persistenceChainStatus: false
};

const initData = createSlice({
  name: "LiveData",
  initialState,
  reducers: {
    fetchLiveDataSaga: (state, action: FetchLiveDataSaga) => {},
    setFuryPrice: (state, action: SetFuryPrice) => {
      state.furyPrice = action.payload;
    },
    setCosmosChainStatus: (state, action: SetChainStatus) => {
      state.furyChainStatus = action.payload;
    },
    setTVU: (state, action: SetTVU) => {
      state.tvu = action.payload;
    },
    setPersistenceChainStatus: (state, action: SetChainStatus) => {
      state.persistenceChainStatus = action.payload;
    }
  }
});

export const {
  fetchLiveDataSaga,
  setFuryPrice,
  setTVU,
  setCosmosChainStatus,
  setPersistenceChainStatus
} = initData.actions;

export default initData.reducer;
