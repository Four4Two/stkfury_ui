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
  setAtomBalance,
  setCosmosBalances,
  setIbcAtomBalance,
  setPersistenceBalances,
  setStkAtomBalance,
  setXprtBalance
} from "../reducers/balances";
import { decimalize } from "../../helpers/utils";
import { CHAIN_ID, IBCChainInfos } from "../../helpers/config";
import { STK_ATOM_MINIMAL_DENOM } from "../../../AppConstants";
import { FetchPendingClaimSaga } from "../reducers/claim/types";
import { setClaimableBalance, setPendingClaimList } from "../reducers/claim";
import { fetchAtomPrice, getTVU } from "../../pages/api/externalAPIs";

import { FetchLiveDataSaga } from "../reducers/liveData/types";
import { setAtomPrice, setTVU } from "../reducers/liveData";
import {
  DelegatedValidators,
  FetchDelegatedValidatorsSaga,
  FetchTokenizeSharesSaga
} from "../reducers/transactions/stake/types";
import {
  setDelegatedValidators,
  setDelegatedValidatorsLoader,
  setTokenizedShares
} from "../reducers/transactions/stake";

const env: string = process.env.NEXT_PUBLIC_ENVIRONMENT!;

let IBCInfo = IBCChainInfos[env].find(
  (chain) => chain.counterpartyChainId === CHAIN_ID[env].cosmosChainID
);

export function* fetchBalance({ payload }: FetchBalanceSaga) {
  const {
    persistenceAddress,
    cosmosAddress,
    persistenceChainInfo,
    cosmosChainInfo
  }: any = payload;
  //fetch balance on persistence chain
  // @ts-ignore
  const persistenceBalances: any = yield fetchAccountBalance(
    persistenceAddress,
    persistenceChainInfo.rpc
  );
  //fetch balance on cosmos chain
  // @ts-ignore
  const cosmosBalances: any = yield fetchAccountBalance(
    cosmosAddress,
    cosmosChainInfo.rpc
  );

  console.log(cosmosBalances, "cosmosBalances1");
  //atom balance on persistence chain
  const ibcAtomBalance = getTokenBalance(
    persistenceBalances,
    IBCInfo!.coinDenom
  );

  //stkAtom balance on persistence chain
  const stkAtomBalance = getTokenBalance(
    persistenceBalances,
    STK_ATOM_MINIMAL_DENOM
  );

  //xprt balance on persistence chain
  const xprtBalance = getTokenBalance(
    persistenceBalances,
    persistenceChainInfo.stakeCurrency.coinMinimalDenom
  );

  //atom balance on cosmos chain
  const atomBalance = getTokenBalance(
    cosmosBalances,
    cosmosChainInfo.stakeCurrency.coinMinimalDenom
  );

  yield put(setIbcAtomBalance(Number(decimalize(ibcAtomBalance))));
  yield put(setXprtBalance(Number(decimalize(xprtBalance))));
  yield put(setStkAtomBalance(Number(decimalize(stkAtomBalance))));
  yield put(setAtomBalance(Number(decimalize(atomBalance))));
  yield put(setCosmosBalances(cosmosBalances));
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
  const [tvu, atomPrice] = yield Promise.all([getTVU(), fetchAtomPrice()]);
  yield put(setAtomPrice(atomPrice));
  yield put(setTVU(tvu));
}

export function* fetchDelegations({ payload }: FetchDelegatedValidatorsSaga) {
  yield put(setDelegatedValidatorsLoader(true));
  const response: DelegatedValidators = yield getDelegations(
    payload.address,
    payload.rpc,
    payload.validators
  );
  yield put(setDelegatedValidators(response));
  yield put(setDelegatedValidatorsLoader(false));
}

export function* fetchTokenizeShares({
  payload
}: FetchTokenizeSharesSaga): any {
  yield put(setDelegatedValidatorsLoader(true));
  const sharesOnPersistence = yield getTokenizedShares(
    payload.srcChainBalances,
    payload!.address,
    payload.srcChain!,
    payload.dstChain!,
    "persistence",
    "cosmos"
  );
  const sharesOnCosmos = yield getTokenizedShares(
    payload.dstChainBalances,
    payload.dstAddress,
    payload.dstChain!,
    payload.dstChain!,
    "cosmos",
    "cosmos"
  );
  yield put(
    setTokenizedShares({
      sharesOnDestinationChain: sharesOnCosmos,
      sharesOnSourceChain: sharesOnPersistence
    })
  );
  yield put(setDelegatedValidatorsLoader(false));
}
