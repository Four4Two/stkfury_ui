import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store/reducers";
import { displayToast } from "../../../molecules/toast";
import { ToastType } from "../../../molecules/toast/types";
import {
  setStakeTxnFailed,
  setStakeTxnStepNumber
} from "../../../../store/reducers/transactions/stake";
import { resetTransaction } from "../../../../store/reducers/transaction";

const StakeToasts = () => {
  const dispatch = useDispatch();
  const { txFailed, stepNumber, liquidStakeType, txFailedResponse } =
    useSelector((state: RootState) => state.stake);

  useEffect(() => {
    if (stepNumber === 5) {
      dispatch(setStakeTxnStepNumber(0));
    }
  }, [stepNumber, dispatch]);

  useEffect(() => {
    if (txFailed) {
      dispatch(setStakeTxnFailed(false));
      dispatch(setStakeTxnStepNumber(0));
      dispatch(resetTransaction());
    }
  }, [txFailed, dispatch]);

  return (
    <>
      {txFailed ? (
        displayToast(
          {
            message: txFailedResponse
          },
          ToastType.ERROR
        )
      ) : (
        <>
          {liquidStakeType === "delegationStaking" &&
          stepNumber === 1 &&
          !txFailed
            ? displayToast(
                {
                  message: "Tokenizing your staked ATOM"
                },
                ToastType.LOADING
              )
            : ""}
          {stepNumber === 2 && !txFailed
            ? displayToast(
                {
                  message:
                    liquidStakeType === "ibcStaking"
                      ? "Deposit Transaction in progress"
                      : "transferring tokenized shares to persistence chain"
                },
                ToastType.LOADING
              )
            : ""}
          {stepNumber === 3 && !txFailed
            ? displayToast(
                {
                  message:
                    liquidStakeType === "delegationStaking" ||
                    liquidStakeType === "tokenizedSharesStaking"
                      ? "tokens transferred to persistence chain"
                      : "Atom transferred to persistence chain successfully"
                },
                ToastType.SUCCESS
              )
            : ""}
          {stepNumber === 4 && !txFailed
            ? displayToast(
                {
                  message: "Liquid Stake Transaction in progress"
                },
                ToastType.LOADING
              )
            : ""}
          {stepNumber === 5 && !txFailed
            ? displayToast(
                {
                  message: "Your ATOM Staked Successfully"
                },
                ToastType.SUCCESS
              )
            : ""}
        </>
      )}
    </>
  );
};

export default StakeToasts;
