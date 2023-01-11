import {
  FetchInitialDataSaga,
  InitialLiquidityFees
} from "../reducers/initialData/types";
import {
  getAPR,
  getExchangeRate,
  getMaxRedeem,
  getFee,
  getTVU
} from "../../pages/api/onChain";
import { fetchOsmosisPoolInfo } from "../../pages/api/externalAPIs";
import { put } from "@redux-saga/core/effects";
import {
  setAPR,
  setExchangeRate,
  setOsmosisInfo,
  setMaxRedeem,
  setRedeemFee,
  setTVU
} from "../reducers/initialData";

export function* fetchInit({ payload }: FetchInitialDataSaga): any {
  const { persistenceChainInfo }: any = payload;
  const [exchangeRate, fee, tvu, maxRedeem] = yield Promise.all([
    getExchangeRate(persistenceChainInfo.rpc),
    getFee(persistenceChainInfo.rpc),
    getTVU(persistenceChainInfo.rpc),
    getMaxRedeem(persistenceChainInfo.rpc)
  ]);
  yield put(setExchangeRate(exchangeRate));
  yield put(setRedeemFee(fee));
  yield put(setTVU(tvu));
  const osmosisInfo: InitialLiquidityFees = yield fetchOsmosisPoolInfo();
  yield put(setOsmosisInfo(osmosisInfo));
  yield put(setMaxRedeem(maxRedeem));
  const apr: number = yield getAPR();
  yield put(setAPR(apr));
}
