import { FetchInitialDataSaga } from "../reducers/initialData/types";
import {
  getAPR,
  getChainStatus,
  getExchangeRate,
  getFee,
  getMaxRedeem,
  getTVU
} from "../../pages/api/onChain";
import { fetchAtomPrice } from "../../pages/api/externalAPIs";
import { put } from "@redux-saga/core/effects";
import {
  setAPR,
  setAtomPrice,
  setCosmosChainStatus,
  setExchangeRate,
  setMaxRedeem,
  setPersistenceChainStatus,
  setRedeemFee,
  setTVU
} from "../reducers/initialData";

export function* fetchInit({ payload }: FetchInitialDataSaga): any {
  const { persistenceChainInfo, cosmosChainInfo }: any = payload;
  const [
    cosmosChainStatus,
    persistenceChainStatus,
    exchangeRate,
    fee,
    atomPrice,
    tvu,
    maxRedeem
  ] = yield Promise.all([
    getChainStatus(cosmosChainInfo.rpc),
    getChainStatus(persistenceChainInfo.rpc),
    getExchangeRate(persistenceChainInfo.rpc),
    getFee(persistenceChainInfo.rpc),
    fetchAtomPrice(),
    getTVU(persistenceChainInfo.rpc),
    getMaxRedeem(persistenceChainInfo.rpc)
  ]);
  yield put(setExchangeRate(exchangeRate));
  yield put(setRedeemFee(fee));
  yield put(setAtomPrice(atomPrice));
  const apr: number = yield getAPR();
  yield put(setAPR(apr));
  yield put(setTVU(tvu));
  yield put(setMaxRedeem(maxRedeem));
  yield put(setCosmosChainStatus(cosmosChainStatus));
  yield put(setPersistenceChainStatus(persistenceChainStatus));
}
