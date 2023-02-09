import {
  FetchInitialDataSaga,
  InitialLiquidityFees,
  InitialTvlApyTypes
} from "../reducers/initialData/types";
import {
  getAPR,
  getExchangeRate,
  getMaxRedeem,
  getFee
} from "../../pages/api/onChain";
import {
  fetchCrescentPoolInfo,
  fetchOsmosisPoolInfo
} from "../../pages/api/externalAPIs";
import { put } from "@redux-saga/core/effects";
import {
  setExchangeRate,
  setOsmosisInfo,
  setMaxRedeem,
  setRedeemFee,
  setCrescentInfo
} from "../reducers/initialData";

export function* fetchInit({ payload }: FetchInitialDataSaga): any {
  const { persistenceChainInfo }: any = payload;
  const [exchangeRate, fee, maxRedeem] = yield Promise.all([
    getExchangeRate(persistenceChainInfo.rpc),
    getFee(persistenceChainInfo.rpc),
    getMaxRedeem(persistenceChainInfo.rpc)
  ]);
  yield put(setExchangeRate(exchangeRate));
  yield put(setRedeemFee(fee));
  const osmosisInfo: InitialLiquidityFees = yield fetchOsmosisPoolInfo();
  const crescentInfo: InitialTvlApyTypes = yield fetchCrescentPoolInfo();
  yield put(setCrescentInfo(crescentInfo));
  yield put(setOsmosisInfo(osmosisInfo));
  yield put(setMaxRedeem(maxRedeem));
}
