import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import { RootState } from "../../../../store/reducers";
import {displayToast} from "../../../molecules/toast";
import {ToastType} from "../../../molecules/toast/types";
import {setStakeTxnStepNumber} from "../../../../store/reducers/transactions/stake";

const StakeToasts = () => {
    const dispatch = useDispatch();
    const {showModal, txFailed, stepNumber} = useSelector((state:RootState) => state.stake);
    const [txnFailed, setTxnFailed] = useState(false);

    useEffect(()=> {
        if(stepNumber === 5 && !showModal) {
            setTimeout(() => dispatch(setStakeTxnStepNumber(0)), 3000);
        }
    },[stepNumber, dispatch, showModal])

    useEffect(()=> {
        if(!showModal && txFailed) {
            dispatch(setStakeTxnStepNumber(0))
            setTxnFailed(txFailed)
        }
    },[txFailed, showModal, dispatch])

    return (
        <>
            { txnFailed && !showModal?
                displayToast(
                    {
                        message: 'This transaction could not be completedd'
                    },
                    ToastType.ERROR
                )
            :
                <>
                    {
                        stepNumber === 2 && !showModal && !txnFailed ?
                            displayToast(
                                {
                                    message: 'Deposit Transaction in progress'
                                },
                                ToastType.LOADING
                            ) : ""
                    }
                    {
                        (stepNumber === 3 && !showModal)  && !txnFailed ?
                            displayToast(
                                {
                                    message: 'Atom transferred to persistence chain successfully'
                                },
                                ToastType.SUCCESS
                            ) : ""
                    }
                    {
                        stepNumber === 4 && !showModal  && !txnFailed ?
                            displayToast(
                                {
                                    message: 'Stake Transaction in progress'
                                },
                                ToastType.LOADING
                            ) : ""
                    }
                    {
                        stepNumber === 5 && !showModal  && !txnFailed ?
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
