import { FetchBalanceSaga } from "../reducers/balances/types";
import {
  fetchAccountBalance,
  fetchAccountClaims,
  fetchClaimableAmount,
  fetchFailedUnbondings
} from "../../pages/api/onChain";
import { put } from "@redux-saga/core/effects";
import { setAtomBalance, setIbcAtomBalance, setStkAtomBalance } from "../reducers/balances";
import {decimalize, printConsole} from "../../helpers/utils";
import { IBCChainInfos } from "../../helpers/config";
import {COSMOS_CHAIN_ID, STK_ATOM_MINIMAL_DENOM} from "../../../AppConstants";
import {FetchPendingClaimSaga} from "../reducers/claim/types";
import {setClaimableBalance, setClaimableStkAtomBalance, setPendingClaimList} from "../reducers/claim";

const env:string = process.env.NEXT_PUBLIC_ENVIRONMENT!;

let IBCInfo = IBCChainInfos[env].find(chain => chain.counterpartyChainId === COSMOS_CHAIN_ID);

export function * fetchBalance({payload}: FetchBalanceSaga) {
  const {persistenceAddress, cosmosAddress, persistenceChainInfo, cosmosChainInfo}:any = payload
  //atom balance on persistence chain
  const ibcAtomBalance:number = yield fetchAccountBalance(persistenceAddress, IBCInfo!.coinDenom, persistenceChainInfo.rpc)
  const stkAtomBalance:number = yield fetchAccountBalance(persistenceAddress, STK_ATOM_MINIMAL_DENOM, persistenceChainInfo.rpc)
 //atom balance on cosmos chain
  const atomBalance:number = yield fetchAccountBalance(cosmosAddress, cosmosChainInfo.stakeCurrency.coinMinimalDenom, cosmosChainInfo.rpc)
  yield put(setIbcAtomBalance(Number(decimalize(ibcAtomBalance))));
  yield put(setStkAtomBalance(Number(decimalize(stkAtomBalance))));
  yield put(setAtomBalance(Number(decimalize(atomBalance))));
}

export function * fetchPendingClaims({payload}: FetchPendingClaimSaga) {
  const {address, persistenceChainInfo}:any = payload
  // @ts-ignore
  const accountClaims:any = yield fetchAccountClaims(address, persistenceChainInfo.rpc);
  const claimableBalance:number = yield fetchClaimableAmount(address, persistenceChainInfo.rpc);
  const claimableStkATOMBalance:number = yield fetchFailedUnbondings(address, persistenceChainInfo.rpc);
  printConsole(claimableBalance, 'accountClaims');
  yield put(setClaimableBalance(claimableBalance))
  yield put(setPendingClaimList(accountClaims))
  yield put(setClaimableStkAtomBalance(claimableStkATOMBalance))
}

