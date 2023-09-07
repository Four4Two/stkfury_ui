import {
  FetchInitialDataSaga,
  FetchValidatorsSaga,
  InitialTvlApyFeeTypes
} from "../reducers/initialData/types";
import {
  getExchangeRateFromRpc,
  getFee,
  getMaxRedeem,
  getValidators
} from "../../pages/api/onChain";
import {
  fetchCrescentPoolInfo,
  fetchDexterPoolInfo,
  fetchOsmosisPoolInfo,
  fetchShadeCollateral,
  fetchShadeInfo,
  fetchUmeeInfo,
  getExchangeRate
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
  setShadeCollateral,
  setValidators
} from "../reducers/initialData";
import { setDelegatedValidatorsLoader } from "../reducers/transactions/stake";
import { Validator as PstakeValidator } from "persistenceonejs/pstake/liquidstakeibc/v1beta1/liquidstakeibc";

const env: string = process.env.NEXT_PUBLIC_ENVIRONMENT!;

export function* fetchInit({ payload }: FetchInitialDataSaga): any {
  const { persistenceChainInfo, cosmosChainInfo }: any = payload;
  const [exchangeRate, redeemFee, maxRedeem] = yield Promise.all([
    env === "Testnet"
      ? getExchangeRateFromRpc(
          persistenceChainInfo.rpc,
          cosmosChainInfo.chainId
        )
      : getExchangeRate(),
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

export function* fetchValidators({ payload }: FetchValidatorsSaga) {
  const response: PstakeValidator[] = yield getValidators(
    payload.rpc,
    payload.chainID
  );
  yield put(setValidators(response));
}
