import { put, takeEvery } from "@redux-saga/core/effects";
import { fetchBalanceSaga} from "../reducers/balances";
import { fetchInitSaga } from "../reducers/initialData";
import { fetchInit } from "./init";
import {
    executeClaimTransaction,
    executeDepositTransaction,
    executeStakeTransaction,
    executeUnStakeTransaction
} from "./transactions";
import { executeStakeTransactionSaga } from "../reducers/transactions/stake";
import { executeUnStakeTransactionSaga } from "../reducers/transactions/unstake";
import { executeDepositTransactionSaga } from "../reducers/transactions/deposit";
import { fetchBalance } from "./fetchingSagas";
import { executeClaimTransactionSaga } from "../reducers/transactions/claim";


export default function* appSaga() {
    yield takeEvery(fetchBalanceSaga.type, fetchBalance);
    yield takeEvery(fetchInitSaga.type, fetchInit)
    yield takeEvery(executeStakeTransactionSaga.type, executeStakeTransaction)
    yield takeEvery(executeUnStakeTransactionSaga.type, executeUnStakeTransaction)
    yield takeEvery(executeDepositTransactionSaga.type, executeDepositTransaction)
    yield takeEvery(executeClaimTransactionSaga.type, executeClaimTransaction)
}