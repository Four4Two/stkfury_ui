import {createSlice} from "@reduxjs/toolkit";
import {TransactionState, TransactionPayload} from "./types";

const initialState: TransactionState = {
  inProgress: false,
  name: "stake"
}

const transaction = createSlice({
  name:"transaction",
  initialState,
  reducers: {
    setTransactionProgress: (state, {payload}: TransactionPayload) => {
      state.inProgress = true
      state.name = payload
    },
    resetTransaction: (state) => {
      state.inProgress = false
    },
  }
})

export const {setTransactionProgress, resetTransaction} = transaction.actions

export default transaction.reducer