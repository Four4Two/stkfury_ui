import { FetchInitialDataSaga } from "../reducers/initialData/types";
import { getExchangeRate } from "../../pages/api/onChain";
import { fetchAtomPrice } from "../../pages/api/externalAPIs";
import { put } from "@redux-saga/core/effects";
import { setAPY, setAtomPrice, setExchangeRate } from "../reducers/initialData";

export function * fetchInit({payload}: FetchInitialDataSaga) {
  const {persistenceChainInfo}:any = payload
  const exchangeRate:number = yield getExchangeRate(persistenceChainInfo.rpc)
  const atomPrice:number = yield fetchAtomPrice()
  yield put(setExchangeRate(exchangeRate));
  yield put(setAtomPrice(atomPrice));
  const apy = 0;
  yield put(setAPY(apy));
}