import { put, select } from "@redux-saga/core/effects";
import { StakeTransactionPayload } from "../reducers/transactions/stake/types";
import {
  resetTransaction,
  setTransactionProgress
} from "../reducers/transaction";
import {
  COSMOS_FEE,
  ERROR_WHILE_CLAIMING,
  ERROR_WHILE_DEPOSITING,
  ERROR_WHILE_STAKING,
  ERROR_WHILE_UNSTAKING,
  FATAL,
  INSTANT,
  PERSISTENCE_FEE,
  STAKE,
  STK_ATOM_MINIMAL_DENOM
} from "../../../AppConstants";
import {
  executeStakeTransactionSaga,
  setStakeAmount,
  setStakeTxnFailed,
  setStakeTxnStepNumber
} from "../reducers/transactions/stake";
import { Transaction } from "../../helpers/transaction";
import { DeliverTxResponse } from "@cosmjs/stargate/build/stargateclient";
import { displayToast } from "../../components/molecules/toast";
import { ToastType } from "../../components/molecules/toast/types";
import {
  genericErrorHandler,
  pollAccountBalance,
  printConsole
} from "../../helpers/utils";
import { failedTransactionActions } from "./sagaHelpers";
import * as Sentry from "@sentry/react";
import {
  UnStakeTransactionPayload,
  unStakeType
} from "../reducers/transactions/unstake/types";
import { toast } from "react-toastify";
import { DepositTransactionPayload } from "../reducers/transactions/deposit/types";
import { CHAIN_ID, IBCChainInfos } from "../../helpers/config";
import { RootState } from "../reducers";
import { ClaimTransactionPayload } from "../reducers/transactions/claim/types";
import { setDepositAmount } from "../reducers/transactions/deposit";
import { setUnStakeAmount } from "../reducers/transactions/unstake";
import { fetchPendingClaimsSaga } from "../reducers/claim";
import { WithdrawTransactionPayload } from "../reducers/transactions/withdraw/types";
import {
  setWithdrawTxnFailed,
  setWithdrawTxnStepNumber
} from "../reducers/transactions/withdraw";

const env: string = process.env.NEXT_PUBLIC_ENVIRONMENT!;

let ibcInfo = IBCChainInfos[env].find(
  (chain) => chain.counterpartyChainId === CHAIN_ID[env].cosmosChainID
);

export function* executeStakeTransaction({ payload }: StakeTransactionPayload) {
  try {
    const {
      persistenceSigner,
      persistenceChainInfo,
      account,
      msg,
      pollInitialBalance
    } = payload;
    const transaction: DeliverTxResponse = yield Transaction(
      persistenceSigner,
      account,
      [msg],
      PERSISTENCE_FEE,
      "",
      persistenceChainInfo.rpc
    );
    yield put(setStakeAmount(""));
    yield put(setStakeTxnStepNumber(4));
    printConsole(transaction, "transaction stake");
    if (transaction.code === 0) {
      const response: string = yield pollAccountBalance(
        account,
        STK_ATOM_MINIMAL_DENOM,
        persistenceChainInfo.rpc,
        pollInitialBalance.toString()
      );
      if (response !== "0") {
        yield put(setStakeTxnStepNumber(5));
      }
      yield put(resetTransaction());
    } else {
      throw new Error(transaction.rawLog);
    }
  } catch (e: any) {
    yield put(setStakeTxnFailed(true));
    yield put(resetTransaction());
    const customScope = new Sentry.Scope();
    customScope.setLevel(FATAL);
    customScope.setTags({
      [ERROR_WHILE_STAKING]: payload.account
    });
    genericErrorHandler(e, customScope);
  }
}

export function* executeUnStakeTransaction({
  payload
}: UnStakeTransactionPayload) {
  try {
    const {
      persistenceSigner,
      persistenceChainInfo,
      address,
      msg,
      pollInitialBalance,
      cosmosAddress,
      cosmosChainInfo
    } = payload;
    const transaction: DeliverTxResponse = yield Transaction(
      persistenceSigner,
      address,
      msg,
      PERSISTENCE_FEE,
      "",
      persistenceChainInfo.rpc
    );
    printConsole(transaction, "transaction unstake");
    yield put(setUnStakeAmount(""));
    if (transaction.code === 0) {
      const state: RootState = yield select();
      const txnType: unStakeType = state?.unStake.type;
      if (txnType === INSTANT) {
        displayToast(
          {
            message: "Transaction in progress"
          },
          ToastType.LOADING
        );
        const response: string = yield pollAccountBalance(
          cosmosAddress,
          cosmosChainInfo?.stakeCurrency.coinMinimalDenom!,
          cosmosChainInfo.rpc,
          pollInitialBalance.toString()
        );
        if (response !== "0") {
          toast.dismiss();
          displayToast(
            {
              message: "Transaction Successful"
            },
            ToastType.SUCCESS
          );
        } else {
          displayToast(
            {
              message: "This transaction could not be completed"
            },
            ToastType.ERROR
          );
        }
      } else {
        displayToast(
          {
            message: "Transaction Successful"
          },
          ToastType.SUCCESS
        );
      }
      yield put(resetTransaction());
    } else {
      throw new Error(transaction.rawLog);
    }
  } catch (e: any) {
    yield put(resetTransaction());
    const customScope = new Sentry.Scope();
    customScope.setLevel(FATAL);
    customScope.setTags({
      [ERROR_WHILE_UNSTAKING]: payload.address
    });
    genericErrorHandler(e, customScope);
    yield failedTransactionActions("");
  }
}

export function* executeClaimTransaction({ payload }: ClaimTransactionPayload) {
  try {
    const {
      persistenceSigner,
      persistenceChainInfo,
      address,
      msg,
      cosmosChainInfo,
      cosmosAddress,
      pollInitialIBCAtomBalance
    } = payload;
    const transaction: DeliverTxResponse = yield Transaction(
      persistenceSigner,
      address,
      msg,
      COSMOS_FEE,
      "",
      persistenceChainInfo.rpc
    );
    printConsole(transaction, "transaction claim");
    if (transaction.code === 0) {
      displayToast(
        {
          message: "Transaction in progress"
        },
        ToastType.LOADING
      );
      const response: string = yield pollAccountBalance(
        cosmosAddress,
        cosmosChainInfo?.stakeCurrency.coinMinimalDenom!,
        cosmosChainInfo.rpc,
        pollInitialIBCAtomBalance.toString()
      );
      if (response !== "0") {
        displayToast(
          {
            message: "Transaction Successful"
          },
          ToastType.SUCCESS
        );
      }
      yield put(resetTransaction());
      yield put(
        fetchPendingClaimsSaga({
          address: address,
          persistenceChainInfo: persistenceChainInfo!
        })
      );
    } else {
      throw new Error(transaction.rawLog);
    }
  } catch (e: any) {
    yield put(resetTransaction());
    const customScope = new Sentry.Scope();
    customScope.setLevel(FATAL);
    customScope.setTags({
      [ERROR_WHILE_CLAIMING]: payload.address
    });
    genericErrorHandler(e, customScope);
    yield failedTransactionActions("");
  }
}

export function* executeDepositTransaction({
  payload
}: DepositTransactionPayload) {
  try {
    yield put(setStakeTxnStepNumber(1));
    const {
      persistenceChainInfo,
      cosmosSigner,
      cosmosChainInfo,
      depositMsg,
      persistenceSigner,
      stakeMsg,
      persistenceAddress,
      cosmosAddress,
      pollInitialDepositBalance,
      pollInitialStakeBalance
    } = payload;
    const transaction: DeliverTxResponse = yield Transaction(
      cosmosSigner,
      cosmosAddress,
      [depositMsg],
      PERSISTENCE_FEE,
      "",
      cosmosChainInfo.rpc
    );
    yield put(setStakeTxnStepNumber(2));
    printConsole(transaction, "transaction deposit");
    yield put(setDepositAmount(""));
    if (transaction.code === 0) {
      const response: string = yield pollAccountBalance(
        persistenceAddress,
        ibcInfo!.coinDenom,
        persistenceChainInfo.rpc,
        pollInitialDepositBalance.toString()
      );
      if (response !== "0") {
        yield put(setStakeTxnStepNumber(3));
        yield put(
          executeStakeTransactionSaga({
            persistenceSigner: persistenceSigner!,
            msg: stakeMsg,
            account: persistenceAddress,
            persistenceChainInfo: persistenceChainInfo!,
            pollInitialBalance: pollInitialStakeBalance
          })
        );
        yield put(setTransactionProgress(STAKE));
      }
    } else {
      throw new Error(transaction.rawLog);
    }
  } catch (e: any) {
    yield put(setStakeTxnFailed(true));
    const customScope = new Sentry.Scope();
    customScope.setLevel(FATAL);
    customScope.setTags({
      [ERROR_WHILE_DEPOSITING]: payload.persistenceAddress
    });
    genericErrorHandler(e, customScope);
  }
}

export function* executeWithdrawTransaction({
  payload
}: WithdrawTransactionPayload) {
  try {
    const {
      persistenceChainInfo,
      cosmosChainInfo,
      withdrawMsg,
      persistenceAddress,
      cosmosAddress,
      persistenceSigner,
      pollInitialIBCAtomBalance
    } = payload;
    yield put(setWithdrawTxnStepNumber(1));
    const transaction: DeliverTxResponse = yield Transaction(
      persistenceSigner,
      persistenceAddress,
      [withdrawMsg],
      PERSISTENCE_FEE,
      "",
      persistenceChainInfo.rpc
    );
    printConsole(transaction, "transaction withdraw");
    yield put(setWithdrawTxnStepNumber(2));
    if (transaction.code === 0) {
      const response: string = yield pollAccountBalance(
        cosmosAddress,
        cosmosChainInfo?.stakeCurrency.coinMinimalDenom!,
        cosmosChainInfo.rpc,
        pollInitialIBCAtomBalance.toString()
      );
      if (response !== "0") {
        yield put(setWithdrawTxnStepNumber(3));
      }
      yield put(resetTransaction());
    } else {
      throw new Error(transaction.rawLog);
    }
  } catch (e: any) {
    yield put(resetTransaction());
    yield put(setWithdrawTxnFailed(true));
    const customScope = new Sentry.Scope();
    customScope.setLevel(FATAL);
    customScope.setTags({
      [ERROR_WHILE_DEPOSITING]: payload.persistenceAddress
    });
    genericErrorHandler(e, customScope);
  }
}
