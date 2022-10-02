import {put} from 'redux-saga/effects'
import React from "react";
import { displayToast } from "../../components/molecules/toast";
import { ToastType } from "../../components/molecules/toast/types";
import { resetTransaction } from "../reducers/transaction";

export function* failedTransactionActions(txnHash:string) {
    displayToast(
      {
          message: `This transaction could not be completed${txnHash ? `: ${txnHash}` : ""}`
      },
      ToastType.ERROR
    );
  yield put(resetTransaction())
}
