import {createSlice} from "@reduxjs/toolkit";
import { WithdrawTransactionPayload, WithdrawState } from "./types";
import {SetTransactionFailedStatus, SetTransactionStep} from "../stake/types";

const initialState: WithdrawState = {
    amount: '',
    showModal: false,
    txFailed: false,
    stepNumber: 0
}

const withdraw = createSlice({
    name: "Withdraw",
    initialState,
    reducers: {
        executeWithdrawTransactionSaga: (state, action:WithdrawTransactionPayload)=>{},
        hideWithdrawModal: (state) => {
            state.showModal = false
        },
        showWithdrawModal: (state) => {
            state.showModal = true
        },
        setWithdrawTxnFailed: (state, {payload}: SetTransactionFailedStatus) => {
            state.txFailed = payload
        },
        setWithdrawTxnStepNumber: (state, {payload}: SetTransactionStep) => {
            state.stepNumber = payload
        },
    }
})

export const { executeWithdrawTransactionSaga,hideWithdrawModal,
    showWithdrawModal, setWithdrawTxnFailed, setWithdrawTxnStepNumber } = withdraw.actions

export default withdraw.reducer