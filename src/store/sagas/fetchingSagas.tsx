import { FetchBalanceSaga } from "../reducers/balances/types";
import {
  fetchAccountBalance,
  fetchUnbondingList,
  getTokenBalance,
  getChainTVU,
  getDelegations,
  getTokenizedShares
} from "../../pages/api/onChain";
import { put } from "@redux-saga/core/effects";
import {
  setFuryBalance,
  setCosmosBalances,
  setIbcFuryBalance,
  setPersistenceBalances,
  setStkFuryBalance,
  setXprtBalance
} from "../reducers/balances";
import { decimalize } from "../../helpers/utils";
import { CHAIN_ID, IBCChainInfos } from "../../helpers/config";
import { STK_FURY_MINIMAL_DENOM } from "../../../AppConstants";
import { FetchPendingClaimSaga } from "../reducers/claim/types";
import { setClaimableBalance, setPendingClaimList } from "../reducers/claim";
import { fetchFuryPrice, getTVU } from "../../pages/api/externalAPIs";

import { FetchLiveDataSaga } from "../reducers/liveData/types";
import { setFuryPrice, setTVU } from "../reducers/liveData";
import {
  DelegatedValidators,
  FetchDelegatedValidatorsSaga,
  FetchTokenizeSharesSaga
} from "../reducers/transactions/stake/types";
import {
  setDelegatedValidators,
  setDelegatedValidatorsLoader,
  setTokenizedShares,
  setTokenizeSharesLoader
} from "../reducers/transactions/stake";

const env: string = process.env.NEXT_PUBLIC_ENVIRONMENT!;

let IBCInfo = IBCChainInfos[env].find(
  (chain) => chain.counterpartyChainId === CHAIN_ID[env].furyChainID
);

export function* fetchBalance({ payload }: FetchBalanceSaga) {
  const {
    persistenceAddress,
    furyAddress,
    persistenceChainInfo,
    furyChainInfo
  }: any = payload;
  //fetch balance on persistence chain
  // @ts-ignore
  const persistenceBalances: any = yield fetchAccountBalance(
    persistenceAddress,
    persistenceChainInfo.rpc
  );
  //fetch balance on fury chain
  // @ts-ignore
  const furyBalances: any = yield fetchAccountBalance(
    furyAddress,
    furyChainInfo.rpc
  );

  console.log(furyBalances, "furyBalances1");
  //fury balance on persistence chain
  const ibcFuryBalance = getTokenBalance(
    persistenceBalances,
    IBCInfo!.coinDenom
  );

  //stkFury balance on persistence chain
  const stkFuryBalance = getTokenBalance(
    persistenceBalances,
    STK_FURY_MINIMAL_DENOM
  );

  //xprt balance on persistence chain
  const xprtBalance = getTokenBalance(
    persistenceBalances,
    persistenceChainInfo.stakeCurrency.coinMinimalDenom
  );

  //fury balance on fury chain
  const furyBalance = getTokenBalance(
    furyBalances,
    furyChainInfo.stakeCurrency.coinMinimalDenom
  );

  yield put(setIbcFuryBalance(Number(decimalize(ibcFuryBalance))));
  yield put(setXprtBalance(Number(decimalize(xprtBalance))));
  yield put(setStkFuryBalance(Number(decimalize(stkFuryBalance))));
  yield put(setFuryBalance(Number(decimalize(furyBalance))));
  yield put(setCosmosBalances(furyBalances));
  yield put(setPersistenceBalances(persistenceBalances));
}

export function* fetchPendingClaims({ payload }: FetchPendingClaimSaga) {
  const { address, persistenceChainInfo, dstChainInfo }: any = payload;
  // @ts-ignore
  const response = yield fetchUnbondingList(
    persistenceChainInfo.rpc,
    address,
    dstChainInfo.chainId
  );
  yield put(setClaimableBalance(response.claimableAmount));
  yield put(setPendingClaimList(response.list));
}

// @ts-ignore
export function* fetchLiveData({ payload }: FetchLiveDataSaga) {
  const { persistenceChainInfo }: any = payload;
  const [tvu, furyPrice] = yield Promise.all([
    getChainTVU(persistenceChainInfo.rpc, "stk/ufury"),
    fetchFuryPrice()
  ]);
  yield put(setFuryPrice(furyPrice));
  yield put(setTVU(tvu));
}

export function* fetchDelegations({ payload }: FetchDelegatedValidatorsSaga) {
  yield put(setDelegatedValidatorsLoader(true));
  const response: DelegatedValidators = yield getDelegations(
    payload.address,
    payload.rpc,
    payload.validators
  );
  console.log(response, "delegatedValidatorsfiect-saga");
  yield put(setDelegatedValidators(response));
  yield put(setDelegatedValidatorsLoader(false));
}

export function* fetchTokenizeShares({
  payload
}: FetchTokenizeSharesSaga): any {
  yield put(setTokenizeSharesLoader(true));
  const sharesOnPersistence = yield getTokenizedShares(
    payload.srcChainBalances,
    payload!.address,
    payload.srcChain!,
    payload.dstChain!,
    "persistence",
    "fury"
  );
  console.log(sharesOnPersistence, "sharesOnPersistence");
  const sharesOnCosmos = yield getTokenizedShares(
    payload.dstChainBalances,
    payload.dstAddress,
    payload.dstChain!,
    payload.dstChain!,
    "fury",
    "fury"
  );
  console.log(sharesOnCosmos, "sharesOnCosmos");
  yield put(
    setTokenizedShares({
      sharesOnDestinationChain: sharesOnCosmos,
      sharesOnSourceChain: sharesOnPersistence
    })
  );
  yield put(setTokenizeSharesLoader(false));
}
