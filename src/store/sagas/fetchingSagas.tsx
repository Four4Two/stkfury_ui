import { FetchBalanceSaga } from "../reducers/balances/types";
import {fetchAccountBalance, fetchAccountClaims, fetchClaimableAmount} from "../../pages/api/onChain";
import { put } from "@redux-saga/core/effects";
import { setAtomBalance, setIbcAtomBalance, setStkAtomBalance } from "../reducers/balances";
import { decimalize } from "../../helpers/utils";
import { IBCChainInfos } from "../../helpers/config";
import {COSMOS_CHAIN_ID, STK_ATOM_MINIMAL_DENOM} from "../../../AppConstants";
import {FetchPendingClaimSaga} from "../reducers/claim/types";
import {setClaimableBalance, setPendingClaimList} from "../reducers/claim";

const env:string = process.env.NEXT_PUBLIC_ENVIRONMENT!;

let IBCInfo = IBCChainInfos[env].find(chain => chain.counterpartyChainId === COSMOS_CHAIN_ID);

export function * fetchBalance({payload}: FetchBalanceSaga) {
  const {persistenceAddress, cosmosAddress, persistenceChainInfo, cosmosChainInfo}:any = payload
  const atomBalance:number = yield fetchAccountBalance(persistenceAddress, IBCInfo!.coinDenom, persistenceChainInfo.rpc)
  const stkAtomBalance:number = yield fetchAccountBalance(persistenceAddress, STK_ATOM_MINIMAL_DENOM, persistenceChainInfo.rpc)
  const ibcAtomBalance:number = yield fetchAccountBalance(cosmosAddress, cosmosChainInfo.stakeCurrency.coinMinimalDenom, cosmosChainInfo.rpc)
  yield put(setAtomBalance(Number(decimalize(atomBalance))));
  yield put(setStkAtomBalance(Number(decimalize(stkAtomBalance))));
  yield put(setIbcAtomBalance(Number(decimalize(ibcAtomBalance))));
}

export function * fetchPendingClaims({payload}: FetchPendingClaimSaga) {
  const {address, persistenceChainInfo}:any = payload
  // @ts-ignore
  const accountClaims:any = yield fetchAccountClaims(address, persistenceChainInfo.rpc);
  const claimableBalance:number = yield fetchClaimableAmount(address, persistenceChainInfo.rpc);
  yield put(setClaimableBalance(claimableBalance))
  yield put(setPendingClaimList(accountClaims))
}
