import {
  FetchInitialDataSaga,
  InitialTvlApyFeeTypes
} from "../reducers/initialData/types";
import {
  getExchangeRateFromRpc,
  getFee,
  getMaxRedeem
} from "../../pages/api/onChain";
import {
  fetchCrescentPoolInfo,
  fetchDexterPoolInfo,
  fetchOsmosisPoolInfo,
  fetchShadeCollateral,
  fetchShadeInfo,
  fetchUmeeInfo
} from "../../pages/api/externalAPIs";
import { put } from "@redux-saga/core/effects";
import {
  setExchangeRate,
  setOsmosisInfo,
  setMaxRedeem,
  setCrescentInfo,
  setRedeemFee,
  setDexterInfo,
  setUmeeInfo,
  setShadeInfo,
  setShadeCollateral
} from "../reducers/initialData";

export function* fetchInit({ payload }: FetchInitialDataSaga): any {
  const { persistenceChainInfo, cosmosChainInfo }: any = payload;
  const [exchangeRate, redeemFee, maxRedeem] = yield Promise.all([
    getExchangeRateFromRpc(persistenceChainInfo.rpc, cosmosChainInfo.chainId),
    getFee(persistenceChainInfo.rpc, cosmosChainInfo.chainId),
    getMaxRedeem(persistenceChainInfo.rpc, cosmosChainInfo.chainId)
  ]);
  yield put(setExchangeRate(exchangeRate));
  yield put(setRedeemFee(redeemFee));
  const osmosisInfo: InitialTvlApyFeeTypes = yield fetchOsmosisPoolInfo();
  const crescentInfo: InitialTvlApyFeeTypes = yield fetchCrescentPoolInfo();
  const dexterInfo: InitialTvlApyFeeTypes = yield fetchDexterPoolInfo();
  const shadeInfo = yield fetchShadeInfo();
  const shadeLendingInfo = yield fetchShadeCollateral();
  const umeeInfo: InitialTvlApyFeeTypes = yield fetchUmeeInfo();
  yield put(setDexterInfo(dexterInfo));
  yield put(setCrescentInfo(crescentInfo));
  yield put(setOsmosisInfo(osmosisInfo));
  yield put(setUmeeInfo(umeeInfo));
  yield put(setShadeCollateral(shadeLendingInfo));
  yield put(setMaxRedeem(maxRedeem));
  yield put(setShadeInfo(shadeInfo));
}
