import { FetchBalanceSaga } from "../reducers/balances/types";
import { fetchAccountBalance } from "../../pages/api/onChain";
import { put } from "@redux-saga/core/effects";
import { setAtomBalance, setIbcAtomBalance, setStkAtomBalance } from "../reducers/balances";
import { decimalize } from "../../helpers/utils";
import { IBCChainInfos } from "../../helpers/config";
import { COSMOS_CHAIN_ID } from "../../../AppConstants";

let IBCInfo = IBCChainInfos['Testnet'].find(chain => chain.counterpartyChainId === COSMOS_CHAIN_ID);

export function * fetchBalance({payload}: FetchBalanceSaga) {
  const {persistenceAddress, cosmosAddress, persistenceChainInfo, cosmosChainInfo}:any = payload
  const atomBalance:number = yield fetchAccountBalance(persistenceAddress, IBCInfo!.coinDenom, persistenceChainInfo.rpc)
  const stkAtomBalance:number = yield fetchAccountBalance(persistenceAddress, "ustkatom", persistenceChainInfo.rpc)
  const ibcAtomBalance:number = yield fetchAccountBalance(cosmosAddress, cosmosChainInfo.stakeCurrency.coinMinimalDenom, cosmosChainInfo.rpc)
  yield put(setAtomBalance(Number(decimalize(atomBalance))));
  yield put(setStkAtomBalance(Number(decimalize(stkAtomBalance))));
  yield put(setIbcAtomBalance(Number(decimalize(ibcAtomBalance))));
}
