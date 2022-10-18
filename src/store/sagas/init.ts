import { FetchInitialDataSaga } from "../reducers/initialData/types";
import {getAPR, getExchangeRate, getFee, getMaxRedeem, getTVU} from "../../pages/api/onChain";
import { fetchAtomPrice } from "../../pages/api/externalAPIs";
import { put } from "@redux-saga/core/effects";
import {setAPR, setAtomPrice, setExchangeRate, setMaxRedeem, setRedeemFee, setTVU} from "../reducers/initialData";

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
  const tvu: number = yield getTVU(persistenceChainInfo.rpc);
  yield put(setTVU(tvu));
  const maxRedeem: number = yield getMaxRedeem(persistenceChainInfo.rpc);
  console.log(maxRedeem, "maxRedeem")
  yield put(setMaxRedeem(maxRedeem));
}
