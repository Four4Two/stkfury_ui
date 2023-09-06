import { put, takeEvery } from "@redux-saga/core/effects";
import { fetchBalanceSaga } from "../reducers/balances";
import { fetchInitSaga } from "../reducers/initialData";
import { fetchInit } from "./init";
import {
  executeClaimTransaction,
  executeDelegationStakeTransaction,
  executeDepositTransaction,
  executeStakeTransaction,
  executeUnStakeTransaction,
  executeWithdrawTransaction
} from "./transactions";
import {
  executeDelegationStakeTransactionSaga,
  executeStakeTransactionSaga,
  fetchDelegatedValidatorsSaga
} from "../reducers/transactions/stake";
import { executeUnStakeTransactionSaga } from "../reducers/transactions/unstake";
import { executeDepositTransactionSaga } from "../reducers/transactions/deposit";
import {
  fetchBalance,
  fetchDelegations,
  fetchLiveData,
  fetchPendingClaims
} from "./fetchingSagas";
import { executeClaimTransactionSaga } from "../reducers/transactions/claim";
import { fetchPendingClaimsSaga } from "../reducers/claim";
import { executeWithdrawTransactionSaga } from "../reducers/transactions/withdraw";
import { fetchLiveDataSaga } from "../reducers/liveData";

export default function* appSaga() {
  yield takeEvery(fetchBalanceSaga.type, fetchBalance);
  yield takeEvery(fetchInitSaga.type, fetchInit);
  yield takeEvery(fetchLiveDataSaga.type, fetchLiveData);
  yield takeEvery(fetchDelegatedValidatorsSaga.type, fetchDelegations);
  yield takeEvery(fetchPendingClaimsSaga.type, fetchPendingClaims);
  yield takeEvery(executeStakeTransactionSaga.type, executeStakeTransaction);
  yield takeEvery(
    executeUnStakeTransactionSaga.type,
    executeUnStakeTransaction
  );
  yield takeEvery(
    executeDepositTransactionSaga.type,
    executeDepositTransaction
  );
  yield takeEvery(executeClaimTransactionSaga.type, executeClaimTransaction);
  yield takeEvery(
    executeWithdrawTransactionSaga.type,
    executeWithdrawTransaction
  );
  yield takeEvery(
    executeDelegationStakeTransactionSaga.type,
    executeDelegationStakeTransaction
  );
}
