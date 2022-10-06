import { FetchInitialDataSaga } from "../reducers/initialData/types";
import {getAPR, getExchangeRate, getFee} from "../../pages/api/onChain";
import { fetchAtomPrice } from "../../pages/api/externalAPIs";
import { put } from "@redux-saga/core/effects";
import {setAPR, setAtomPrice, setExchangeRate, setRedeemFee} from "../reducers/initialData";

export function* fetchInit({ payload }: FetchInitialDataSaga) {
  const { persistenceChainInfo }: any = payload;
  const exchangeRate: number = yield getExchangeRate(persistenceChainInfo.rpc);
  const fee: number = yield getFee(persistenceChainInfo.rpc);
  const atomPrice: number = yield fetchAtomPrice();
  yield put(setRedeemFee(fee));
  yield put(setExchangeRate(exchangeRate));
  yield put(setAtomPrice(atomPrice));
  const apr: number = yield getAPR();
  yield put(setAPR(apr));
}
