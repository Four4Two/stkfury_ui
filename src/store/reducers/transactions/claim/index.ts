import {createSlice} from "@reduxjs/toolkit";
import { ClaimTransactionPayload } from "./types";

const claim = createSlice({
  name: "Claim",
  initialState: null,
  reducers: {
    executeClaimTransactionSaga: (state, action:ClaimTransactionPayload)=>{},
  }
})

export const { executeClaimTransactionSaga } = claim.actions

export default claim.reducer