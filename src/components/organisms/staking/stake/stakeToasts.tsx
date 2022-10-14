import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import { RootState } from "../../../../store/reducers";
import {displayToast} from "../../../molecules/toast";
import {ToastType} from "../../../molecules/toast/types";
import {setStakeTxnFailed, setStakeTxnStepNumber} from "../../../../store/reducers/transactions/stake";
import {resetTransaction} from "../../../../store/reducers/transaction";

const StakeToasts = () => {
    const dispatch = useDispatch();
    const {showModal, txFailed, stepNumber} = useSelector((state:RootState) => state.stake);

    useEffect(()=> {
        if(stepNumber === 5 && !showModal) {
            dispatch(setStakeTxnStepNumber(0))
        }
    },[stepNumber, dispatch, showModal])

    useEffect(()=>{
        if(!showModal && txFailed) {
            dispatch(setStakeTxnFailed(false))
            dispatch(setStakeTxnStepNumber(0))
            dispatch(resetTransaction())
        }
    },[txFailed, showModal, dispatch])

    return (
        <>
            { txFailed && !showModal ?
                displayToast(
                    {
                        message: 'This transaction could not be completed'
                    },
                    ToastType.ERROR
                )
            :
                <>
                    {
                        stepNumber === 2 && !showModal && !txFailed ?
                            displayToast(
                                {
                                    message: 'Deposit Transaction in progress'
                                },
                                ToastType.LOADING
                            ) : ""
                    }
                    {
                        stepNumber === 3 && !showModal  && !txFailed?
                            displayToast(
                                {
                                    message: 'Atom transferred to persistence chain successfully'
                                },
                                ToastType.SUCCESS
                            ) : ""
                    }
                    {
                        stepNumber === 4 && !showModal  && !txFailed ?
                            displayToast(
                                {
                                    message: 'Stake Transaction in progress'
                                },
                                ToastType.LOADING
                            ) : ""
                    }
                    {
                        stepNumber === 5 && !showModal  && !txFailed ?
                            displayToast(
                                {
                                    message: 'Your ATOM Staked Successfully'
                                },
                                ToastType.SUCCESS
                            ) : ""
                    }
                </>
            }
        </>
    )
};

export default StakeToasts;
