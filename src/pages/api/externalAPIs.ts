import Axios from "axios";
import { decimalize, genericErrorHandler } from "../../helpers/utils";
import { Scope } from "@sentry/nextjs";
import { APR_DEFAULT, CRESCENT_STK_ATOM_DENOM } from "../../../AppConstants";
import { initialTVLAPY } from "../../store/reducers/initialData";
import { InitialTvlApyFeeTypes } from "../../store/reducers/initialData/types";

export const ATOM_PRICE_URL = "https://api.coingecko.com/api/v3/coins/cosmos";
export const OSMOSIS_POOL_URL = "https://api-osmosis.imperator.co/pools/v2/886";
export const OSMOSIS_POOL_APR_URL = "https://api.osmosis.zone/apr/v2/886";
export const CRESCENT_POOL_URL = "https://apigw-v3.crescent.network/pool/live";
export const APY_API = "https://api.persistence.one/pstake/stkatom/apy";

export const fetchAtomPrice = async (): Promise<number> => {
  try {
    const res = await Axios.get(ATOM_PRICE_URL);
    if (res && res.data) {
      return res.data.market_data.current_price.usd;
    }
    return 1;
  } catch (e) {
    const customScope = new Scope();
    customScope.setLevel("fatal");
    customScope.setTags({
      "Error fetching price of ATOM": ATOM_PRICE_URL
    });
    genericErrorHandler(e, customScope);
    return 0;
  }
};

export const getstkAtomAPY = async (): Promise<number> => {
  try {
    const res = await Axios.get(APY_API);
    if (res && res.data) {
      return Number((res.data * 100).toFixed(2));
    }
    return -1;
  } catch (e) {
    const customScope = new Scope();
    customScope.setLevel("fatal");
    customScope.setTags({
      "Error fetching apy": APY_API
    });
    genericErrorHandler(e, customScope);
    return -1;
  }
};

export const fetchOsmosisPoolInfo = async () => {
  try {
    const responses = await Axios.all([
      Axios.get(OSMOSIS_POOL_URL),
      Axios.get(OSMOSIS_POOL_APR_URL)
    ]);
    const responseOne = responses[0];
    const responseTwo = responses[1];

    const osmoInfo: InitialTvlApyFeeTypes = {
      fees: 0,
      total_apy: 0,
      tvl: 0
    };

    if (responseTwo && responseTwo.data) {
      osmoInfo.total_apy = Math.round(
        responseTwo.data[0].apr_list[0].apr_14d +
          responseTwo.data[0].apr_list[1].apr_14d
      ).toFixed(2);
    } else {
      osmoInfo.total_apy = 0;
    }
    if (responseOne && responseOne.data) {
      osmoInfo.tvl = Math.round(responseOne.data[0].liquidity).toFixed(2);
      osmoInfo.fees = responseOne.data[0].fees;
    } else {
      osmoInfo.fees = 0;
      osmoInfo.tvl = 0;
    }
    return osmoInfo;
  } catch (e) {
    const customScope = new Scope();
    customScope.setLevel("fatal");
    customScope.setTags({
      "Error fetching info from osmosis": OSMOSIS_POOL_URL
    });
    genericErrorHandler(e, customScope);
    return initialTVLAPY;
  }
};

export const fetchCrescentPoolInfo = async () => {
  try {
    const res = await Axios.get(CRESCENT_POOL_URL);
    if (res && res.data) {
      const response = res.data.data;
      let crescentInfo = response.find(
        (item: any) => item!.Reserved[1]?.denom === CRESCENT_STK_ATOM_DENOM
      );
      const atomTvl =
        Number(crescentInfo.Reserved[0].amount) *
        crescentInfo.Reserved[0].priceOracle;
      const stkAtomTvl =
        Number(crescentInfo.Reserved[1].amount) *
        crescentInfo.Reserved[1].priceOracle;
      return {
        tvl: Number(decimalize(atomTvl + stkAtomTvl)).toFixed(2),
        total_apy: Number(crescentInfo?.apr).toFixed(2)
      };
    }
  } catch (e) {
    const customScope = new Scope();
    customScope.setLevel("fatal");
    customScope.setTags({
      "Error fetching info from crescent": CRESCENT_POOL_URL
    });
    genericErrorHandler(e, customScope);
    return initialTVLAPY;
  }
  return initialTVLAPY;
};
