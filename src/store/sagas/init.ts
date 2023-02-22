import {
  FetchInitialDataSaga,
  InitialTvlApyFeeTypes
} from "../reducers/initialData/types";
import { getMaxRedeem } from "../../pages/api/onChain";
import {
  fetchCrescentPoolInfo,
  fetchOsmosisPoolInfo,
  getExchangeRate
} from "../../pages/api/externalAPIs";
import { put } from "@redux-saga/core/effects";
import {
  setExchangeRate,
  setOsmosisInfo,
  setMaxRedeem,
  setCrescentInfo
} from "../reducers/initialData";

export function* fetchInit({ payload }: FetchInitialDataSaga): any {
  const { persistenceChainInfo }: any = payload;
  const [exchangeRate, maxRedeem] = yield Promise.all([
    getExchangeRate(),
    getMaxRedeem(persistenceChainInfo.rpc)
  ]);
  yield put(setExchangeRate(exchangeRate));
  const osmosisInfo: InitialTvlApyFeeTypes = yield fetchOsmosisPoolInfo();
  const crescentInfo: InitialTvlApyFeeTypes = yield fetchCrescentPoolInfo();
  yield put(setCrescentInfo(crescentInfo));
  yield put(setOsmosisInfo(osmosisInfo));
  yield put(setMaxRedeem(maxRedeem));
}
