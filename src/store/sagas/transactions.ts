import { put, select } from "@redux-saga/core/effects";
import { StakeTransactionPayload } from "../reducers/transactions/stake/types";
import { resetTransaction, setTransactionProgress } from "../reducers/transaction";
import {
  CLAIM,
  COSMOS_CHAIN_ID, DEPOSIT, ERROR_WHILE_CLAIMING,
  ERROR_WHILE_DEPOSITING,
  ERROR_WHILE_STAKING,
  ERROR_WHILE_UNSTAKING, FATAL,
  PERSISTENCE_FEE, STAKE, STK_ATOM_MINIMAL_DENOM, UN_STAKE
} from "../../../AppConstants";
import { setStakeAmount } from "../reducers/transactions/stake";
import { Transaction } from "../../helpers/transaction";
import { DeliverTxResponse } from "@cosmjs/stargate/build/stargateclient";
import { displayToast } from "../../components/molecules/toast";
import { ToastType } from "../../components/molecules/toast/types";
import { genericErrorHandler, pollAccountBalance } from "../../helpers/utils";
import { failedTransactionActions } from "./sagaHelpers";
import * as Sentry from "@sentry/react"
import { UnStakeTransactionPayload } from "../reducers/transactions/unstake/types";
import { toast } from "react-toastify";
import { DepositTransactionPayload } from "../reducers/transactions/deposit/types";
import { IBCChainInfos } from "../../helpers/config";
import { RootState } from "../reducers";
import { ClaimTransactionPayload } from "../reducers/transactions/claim/types";
import { hideDepositModal, setDepositAmount } from "../reducers/transactions/deposit";
import { setUnStakeAmount } from "../reducers/transactions/unstake";

const env:string = process.env.NEXT_PUBLIC_ENVIRONMENT!;

let ibcInfo = IBCChainInfos[env].find(chain => chain.counterpartyChainId === COSMOS_CHAIN_ID);

export function* executeStakeTransaction({ payload }: StakeTransactionPayload) {
  try {
    yield put(setTransactionProgress(STAKE));
    const {persistenceSigner, persistenceChainInfo, account, msg} = payload
    const transaction:DeliverTxResponse = yield Transaction(persistenceSigner, account, [msg], PERSISTENCE_FEE, "", persistenceChainInfo.rpc);
    yield put(setStakeAmount(""))
    if (transaction.code === 0) {
      displayToast(
        {
          message: 'Transaction in progress'
        },
        ToastType.LOADING
      );
      const state:RootState = yield select();
      const availableStkAtom = state?.balances.stkAtomBalance;
      const response:string = yield pollAccountBalance(account, STK_ATOM_MINIMAL_DENOM, persistenceChainInfo.rpc, availableStkAtom.toString());
      if (response !== "0") {
        toast.dismiss();
        displayToast(
          {
            message: 'Transaction Successful'
          },
          ToastType.SUCCESS
        );
      } else {
        displayToast(
          {
            message: 'This transaction could not be completed'
          },
          ToastType.ERROR
        );
      }
      yield put(resetTransaction())
    } else {
      throw new Error(transaction.rawLog);
    }
  } catch (e:any) {
    console.log("error came ", e)
    yield put(resetTransaction())
    const customScope = new Sentry.Scope();
    customScope.setLevel(FATAL)
    customScope.setTags({
      [ERROR_WHILE_STAKING]: payload.account
    })
    genericErrorHandler(e, customScope)
    yield failedTransactionActions("")
  }
}

export function* executeUnStakeTransaction({ payload }: UnStakeTransactionPayload) {
  try {
    yield put(setTransactionProgress(UN_STAKE));
    const {persistenceSigner, persistenceChainInfo, account, msg} = payload
    const transaction:DeliverTxResponse = yield Transaction(persistenceSigner, account, [msg], PERSISTENCE_FEE, "", persistenceChainInfo.rpc);
    yield put(setUnStakeAmount(""))
    if (transaction.code === 0) {
      displayToast(
        {
          message: 'Transaction in progress'
        },
        ToastType.LOADING
      );
      const state:RootState = yield select();
      const availableAtom = state?.balances.atomBalance;
      const response:string = yield pollAccountBalance(account, ibcInfo!.coinDenom, persistenceChainInfo.rpc, availableAtom.toString());
      if (response !== "0") {
        toast.dismiss();
        displayToast(
          {
            message: 'Transaction Successful'
          },
          ToastType.SUCCESS
        );
      } else {
        displayToast(
          {
            message: 'This transaction could not be completed'
          },
          ToastType.ERROR
        );
      }
      yield put(resetTransaction())
    } else {
      throw new Error(transaction.rawLog);
    }
  } catch (e:any) {
    yield put(resetTransaction())
    const customScope = new Sentry.Scope();
    customScope.setLevel(FATAL)
    customScope.setTags({
      [ERROR_WHILE_UNSTAKING]: payload.account
    })
    genericErrorHandler(e, customScope)
    yield failedTransactionActions("")
  }
}

export function* executeClaimTransaction({ payload }: ClaimTransactionPayload) {
  try {
    yield put(setTransactionProgress(CLAIM));
    const {persistenceSigner, persistenceChainInfo, address, msg} = payload
    const transaction:DeliverTxResponse = yield Transaction(persistenceSigner, address, [msg], PERSISTENCE_FEE, "", persistenceChainInfo.rpc);
    if (transaction.code === 0) {
      displayToast(
        {
          message: 'Transaction Successful'
        },
        ToastType.SUCCESS
      );
      yield put(resetTransaction())
    } else {
      throw new Error(transaction.rawLog);
    }
  } catch (e:any) {
    yield put(resetTransaction())
    const customScope = new Sentry.Scope();
    customScope.setLevel(FATAL)
    customScope.setTags({
      [ERROR_WHILE_CLAIMING]: payload.address
    })
    genericErrorHandler(e, customScope)
    yield failedTransactionActions("")
  }
}

export function* executeDepositTransaction({ payload }: DepositTransactionPayload) {
  try {
    yield put(setTransactionProgress(DEPOSIT));
    const {persistenceChainInfo, cosmosSigner, cosmosChainInfo, msg, persistenceAddress, cosmosAddress} = payload
    const transaction:DeliverTxResponse = yield Transaction(cosmosSigner, cosmosAddress, [msg], PERSISTENCE_FEE, "", cosmosChainInfo.rpc);
    yield put(setDepositAmount(""))
    if (transaction.code === 0) {
      displayToast(
        {
          message: 'Transaction in progress'
        },
        ToastType.LOADING
      );
      const state:RootState = yield select();
      const availableATOM = state?.balances.atomBalance;
      const response:string = yield pollAccountBalance(persistenceAddress, ibcInfo!.coinDenom, persistenceChainInfo.rpc, availableATOM.toString());
      if (response !== "0") {
        toast.dismiss();
        displayToast(
          {
            message: 'Transaction Successful'
          },
          ToastType.SUCCESS
        );
      } else {
        console.log("in try else")
        displayToast(
          {
            message: 'This transaction could not be completed'
          },
          ToastType.ERROR
        );
      }
      yield put(hideDepositModal())
      yield put(resetTransaction())
    } else {
      throw new Error(transaction.rawLog);
    }
  } catch (e:any) {
    console.log("in catch")
    yield put(resetTransaction())
    const customScope = new Sentry.Scope();
    customScope.setLevel(FATAL)
    customScope.setTags({
      [ERROR_WHILE_DEPOSITING]: payload.persistenceAddress
    })
    genericErrorHandler(e, customScope)
    yield failedTransactionActions("")
  }
}


