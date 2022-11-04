import {
  FetchInitialDataSaga,
  InitialLiquidityFees
} from "../reducers/initialData/types";
import {
  getAPR,
  getExchangeRate,
  getChainStatus,
  getMaxRedeem,
  getFee,
  getTVU
} from "../../pages/api/onChain";
import {
  fetchAtomPrice,
  fetchOsmosisPoolInfo
} from "../../pages/api/externalAPIs";
import { put } from "@redux-saga/core/effects";
import {
  setAPR,
  setAtomPrice,
  setExchangeRate,
  setOsmosisInfo,
  setCosmosChainStatus,
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
  const osmosisInfo: InitialLiquidityFees = yield fetchOsmosisPoolInfo();
  yield put(setOsmosisInfo(osmosisInfo));
  yield put(setTVU(tvu));
  yield put(setMaxRedeem(maxRedeem));
  yield put(setCosmosChainStatus(cosmosChainStatus));
  yield put(setPersistenceChainStatus(persistenceChainStatus));
}
