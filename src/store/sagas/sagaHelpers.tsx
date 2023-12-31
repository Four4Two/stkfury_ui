import { put } from "redux-saga/effects";
import React from "react";
import { displayToast } from "../../components/molecules/toast";
import { ToastType } from "../../components/molecules/toast/types";
import { resetTransaction } from "../reducers/transaction";
import { fetchBalanceSaga } from "../reducers/balances";
import { ChainInfo } from "@keplr-wallet/types";
import { fetchPendingClaimsSaga } from "../reducers/claim";
import { TransactionType } from "../reducers/transaction/types";

export function* failedTransactionActions(txnHash: string) {
  displayToast(
    {
      message: `This transaction could not be completed${
        txnHash ? `: ${txnHash}` : ""
      }`
    },
    ToastType.ERROR
  );
  yield put(resetTransaction());
}

export function* postTransactionActions(
  type: TransactionType,
  persistenceAddress: string,
  furyAddress: string,
  persistenceChainData: ChainInfo,
  furyChainData: ChainInfo
) {
  yield put(resetTransaction());
  yield put(
    fetchBalanceSaga({
      persistenceAddress: persistenceAddress,
      furyAddress: furyAddress,
      persistenceChainInfo: persistenceChainData!,
      furyChainInfo: furyChainData!
    })
  );
  if (type === "unstake" || type === "claim") {
    yield put(
      fetchPendingClaimsSaga({
        address: persistenceAddress,
        persistenceChainInfo: persistenceChainData!,
        dstChainInfo: furyChainData
      })
    );
  }
}
