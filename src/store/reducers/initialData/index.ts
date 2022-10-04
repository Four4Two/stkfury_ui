import {createSlice} from "@reduxjs/toolkit";
import {
    SetAPY,
    SetAtomPrice,
    SetExchangeRate,
    FetchInitialDataSaga,
    InitialDataState
} from "./types";

const initialState: InitialDataState = {
    exchangeRate: 1,
    atomPrice:0,
    apy:0
}

const initData = createSlice({
    name: "InitData",
    initialState,
    reducers: {
        fetchInitSaga: (state, action:FetchInitialDataSaga)=>{},
        setExchangeRate: (state, action: SetExchangeRate) => {
            state.exchangeRate = action.payload
        },
        setAPY: (state, action: SetAPY) => {
            state.apy = action.payload
        },
        setAtomPrice: (state, action: SetAtomPrice) => {
            state.atomPrice = action.payload
        },
    }
})

export const {setAPY, setAtomPrice, fetchInitSaga, setExchangeRate} = initData.actions

export default initData.reducer