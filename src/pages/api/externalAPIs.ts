import Axios from "axios";
import { decimalize, genericErrorHandler } from "../../helpers/utils";
import { Scope } from "@sentry/nextjs";
import {
  CRESCENT_STK_ATOM_DENOM,
  FEES,
  POOL_LIQUIDITY
} from "../../../AppConstants";

export const ATOM_PRICE_URL = "https://api.coingecko.com/api/v3/coins/cosmos";
export const OSMOSIS_POOL_URL = "https://api-osmosis.imperator.co/pools/v2/886";
export const CRESCENT_POOL_URL = "https://apigw-v3.crescent.network/pool/live";

const initialLiquidity_Fees = { [POOL_LIQUIDITY]: 0, [FEES]: 0 };

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
  return 0;
};

export const fetchOsmosisPoolInfo = async () => {
  try {
    const res = await Axios.get(OSMOSIS_POOL_URL);
    if (res && res.data) {
      return {
        [POOL_LIQUIDITY]: Math.round(res.data[0].liquidity).toLocaleString(),
        [FEES]: res.data[0].fees
      };
    }
  } catch (e) {
    const customScope = new Scope();
    customScope.setLevel("fatal");
    customScope.setTags({
      "Error fetching info from osmosis": OSMOSIS_POOL_URL
    });
    genericErrorHandler(e, customScope);
    return initialLiquidity_Fees;
  }
  return initialLiquidity_Fees;
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
        tvl: Number(decimalize(atomTvl + stkAtomTvl)).toLocaleString(),
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
    return initialLiquidity_Fees;
  }
  return initialLiquidity_Fees;
};
