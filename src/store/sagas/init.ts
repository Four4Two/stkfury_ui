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
  setExchangeRate,
  setMaxRedeem,
  setRedeemFee,
  setTVU
} from "../reducers/initialData";
import { printConsole } from "../../helpers/utils";

export function* fetchInit({ payload }: FetchInitialDataSaga) {
  const { persistenceChainInfo, cosmosChainInfo }: any = payload;
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
  const status: boolean = yield getChainStatus(
    persistenceChainInfo.rpc,
    cosmosChainInfo.rpc
  );
  printConsole(status, "status");
  yield put(setMaxRedeem(maxRedeem));
}
