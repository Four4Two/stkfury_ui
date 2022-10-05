import {createSlice} from "@reduxjs/toolkit";
import {
    ClaimState,
    SetPendingClaimList,
    SetClaimableBalance,
    FetchPendingClaimSaga,
} from "./types";

const initialState: ClaimState = {
    pendingClaimList: [],
    claimableBalance:0,
}

const claimQueries = createSlice({
    name: "ClaimQueries",
    initialState,
    reducers: {
        fetchPendingClaimsSaga: (state, action:FetchPendingClaimSaga)=>{},
        setPendingClaimList: (state, action: SetPendingClaimList) => {
            state.pendingClaimList = action.payload
        },
        setClaimableBalance: (state, action: SetClaimableBalance) => {
            state.claimableBalance = action.payload
        },

    }
})

export const {fetchPendingClaimsSaga, setPendingClaimList, setClaimableBalance} = claimQueries.actions

export default claimQueries.reducer