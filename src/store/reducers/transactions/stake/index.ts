import {createSlice} from "@reduxjs/toolkit";
import { SetStakeAmount, StakeAmount, StakeTransactionPayload } from "./types";

const initialState: StakeAmount = {
  amount: '',
}

const stake = createSlice({
  name: "Stake",
  initialState,
  reducers: {
    executeStakeTransactionSaga: (state, action:StakeTransactionPayload)=>{},
    setStakeAmount: (state, { payload }: SetStakeAmount) => {
      state.amount = payload
    },
  }
})

export const {setStakeAmount, executeStakeTransactionSaga} = stake.actions

export default stake.reducer