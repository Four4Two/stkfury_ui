import Axios from "axios";
import {
  decimalize,
  decimalizeRaw,
  genericErrorHandler
} from "../../helpers/utils";
import { Scope } from "@sentry/nextjs";
import { APR_DEFAULT, CRESCENT_STK_FURY_DENOM } from "../../../AppConstants";
import { initialTVLAPY } from "../../store/reducers/initialData";
import {
  InitialTvlApyFeeTypes,
  ShadeInitialInfo
} from "../../store/reducers/initialData/types";
export const SHADE_URL =
  "https://na36v10ce3.execute-api.us-east-1.amazonaws.com/API-mainnet-STAGE/shadeswap/pairs";
export const FURY_PRICE_URL = "https://api.coingecko.com/api/v3/coins/cosmos";
export const OSMOSIS_POOL_URL = "https://api-osmosis.imperator.co/pools/v2/886";
export const OSMOSIS_POOL_APR_URL = "https://api.osmosis.zone/apr/v2/886";
export const CRESCENT_POOL_URL = "https://apigw-v3.crescent.network/pool/live";
export const UMEE_URL =
  "https://testnet-client-bff-ocstrhuppq-uc.a.run.app/convexity/assets/all";
export const STK_FURY_APY_API =
  "https://api.persistence.one/pstake/stkfury/apy";
export const STK_FURY_CVALUE_API =
  "https://api.persistence.one/pstake/stkfury/c_value";
export const STK_FURY_TVU_API =
  "https://api.persistence.one/pstake/stkfury/fury_tvu";
export const DEXTER_POOL_URL = "https://api.core-1.dexter.zone/v1/graphql";
export const SHADE_LCD = "https://lcd.secret.express";
import { SecretNetworkClient } from "secretjs";

export const fetchFuryPrice = async (): Promise<number> => {
  try {
    const res = await Axios.get(FURY_PRICE_URL);
    if (res && res.data) {
      return res.data.market_data.current_price.usd;
    }
    return 1;
  } catch (e) {
    const customScope = new Scope();
    customScope.setLevel("fatal");
    customScope.setTags({
      "Error fetching price of FURY": FURY_PRICE_URL
    });
    genericErrorHandler(e, customScope);
    return 0;
  }
};

export const getStkFuryAPY = async (): Promise<number> => {
  try {
    const res = await Axios.get(STK_FURY_APY_API);
    if (res && res.data) {
      return Number((res.data * 100).toFixed(2));
    }
    return -1;
  } catch (e) {
    const customScope = new Scope();
    customScope.setLevel("fatal");
    customScope.setTags({
      "Error fetching apy": STK_FURY_APY_API
    });
    genericErrorHandler(e, customScope);
    return -1;
  }
};

export const getExchangeRate = async (): Promise<number> => {
  try {
    const res = await Axios.get(STK_FURY_CVALUE_API);
    if (res && res.data) {
      return Number(res.data);
    }
    return 1;
  } catch (e) {
    const customScope = new Scope();
    customScope.setLevel("fatal");
    customScope.setTags({
      "Error while fetching exchange rate": STK_FURY_CVALUE_API
    });
    genericErrorHandler(e, customScope);
    return 1;
  }
};

export const getTVU = async (): Promise<number> => {
  try {
    const res = await Axios.get(STK_FURY_TVU_API);
    if (res && res.data) {
      return Number(res?.data!.amount!.amount);
    }
    return 0;
  } catch (e) {
    const customScope = new Scope();
    customScope.setLevel("fatal");
    customScope.setTags({
      "Error while fetching tvu": STK_FURY_TVU_API
    });
    genericErrorHandler(e, customScope);
    return 0;
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
      let poolIncentiveApr = 0;
      if (responseTwo.data[0].apr_list.length) {
        responseTwo.data[0].apr_list.forEach((item: any) => {
          poolIncentiveApr += item.apr_14d;
        });
      }
      osmoInfo.total_apy = poolIncentiveApr.toFixed(2);
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
        (item: any) => item!.Reserved[1]?.denom === CRESCENT_STK_FURY_DENOM
      );
      const furyTvl =
        Number(crescentInfo.Reserved[0].amount) *
        crescentInfo.Reserved[0].priceOracle;
      const stkFuryTvl =
        Number(crescentInfo.Reserved[1].amount) *
        crescentInfo.Reserved[1].priceOracle;
      return {
        tvl: Number(decimalize(furyTvl + stkFuryTvl)).toFixed(2),
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

export const fetchDexterPoolInfo = async () => {
  try {
    const res = await fetch(DEXTER_POOL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: `{
            pool_weekly_aggregate_with_apr(where: {pool_id: {_eq: 1}}) {
              pool_id
              total_swap_fee
              current_liquidity_usd
              total_volume
              apr
            }
            pool_current_incentive_apr(where: {pool_id: {_eq: 1}}) {
               incentive_apr
               pool_id
            }
          }`
      })
    });
    const responseJson = await res.json();
    console.log(responseJson, "responseJson");
    if (responseJson && responseJson.data) {
      const poolAggregate = responseJson.data.pool_weekly_aggregate_with_apr[0];
      const poolIncentiveAprList =
        responseJson.data.pool_current_incentive_apr?.filter((item: any) => {
          return item.pool_id === 1;
        });
      let poolIncentiveApr = 0;
      if (poolIncentiveAprList && poolIncentiveAprList.length) {
        poolIncentiveAprList.forEach((item: any) => {
          poolIncentiveApr += item.incentive_apr;
        });
      }
      return {
        fees: "0.3%",
        total_apy: (
          poolIncentiveApr + (poolAggregate.apr ? poolAggregate.apr : 0)
        ).toFixed(2),
        tvl: poolAggregate.current_liquidity_usd!.toFixed(2)
      };
    }
    return initialTVLAPY;
  } catch (e) {
    const customScope = new Scope();
    customScope.setLevel("fatal");
    customScope.setTags({
      "Error fetching info from dexter": DEXTER_POOL_URL
    });
    genericErrorHandler(e, customScope);
    return initialTVLAPY;
  }
};

export const fetchShadeInfo = async (): Promise<ShadeInitialInfo> => {
  try {
    const res = await Axios.get(SHADE_URL);
    if (res && res.data) {
      const stkFURYSilk = res.data.find(
        (item: any) => item.id === "ec478c0a-c7cd-4327-b6cb-8d01ca87d319"
      );
      const furyStkFURY = res.data.find(
        (item: any) => item.id === "1d7f9ba8-b4be-4a34-a54d-63554f14f8fb"
      );
      console.log(stkFURYSilk, "stkFURYSilk", furyStkFURY);
      return {
        stkFURYSilk: {
          total_apy: Number(stkFURYSilk.apr.total).toFixed(2),
          tvl: Number(stkFURYSilk.liquidity_usd).toFixed(2),
          fees: (Number(stkFURYSilk.fees.lp) * 100).toFixed(2)
        },
        furyStkFury: {
          total_apy: Number(furyStkFURY.apr.total).toFixed(2),
          tvl: Number(furyStkFURY.liquidity_usd).toFixed(2),
          fees: (Number(furyStkFURY.fees.lp) * 100).toFixed(2)
        }
      };
    }
    return {
      stkFURYSilk: initialTVLAPY,
      furyStkFury: initialTVLAPY
    };
  } catch (e) {
    const customScope = new Scope();
    customScope.setLevel("fatal");
    customScope.setTags({
      "Error fetching info from umee": SHADE_URL
    });
    genericErrorHandler(e, customScope);
    return {
      stkFURYSilk: initialTVLAPY,
      furyStkFury: initialTVLAPY
    };
  }
};

export const fetchUmeeInfo = async (): Promise<InitialTvlApyFeeTypes> => {
  try {
    const res = await Axios.get(UMEE_URL);
    if (res && res.data) {
      const stkfury = res.data.find((item: any) => item.asset === "STKFURY");
      if (stkfury) {
        return {
          borrow_apy: Number(stkfury.borrow_apy).toFixed(2),
          lending_apy: Number(stkfury.supply_apy).toFixed(2),
          total_supply: Number(stkfury.market_size_usd).toFixed(2)
        };
      }
      return initialTVLAPY;
    }
    return initialTVLAPY;
  } catch (e) {
    const customScope = new Scope();
    customScope.setLevel("fatal");
    customScope.setTags({
      "Error fetching info from umee": UMEE_URL
    });
    genericErrorHandler(e, customScope);
    return initialTVLAPY;
  }
};

export const fetchShadeCollateral =
  async (): Promise<InitialTvlApyFeeTypes> => {
    try {
      let stkFuryPrice = 1;
      const res = await Axios.get(
        "https://api.coingecko.com/api/v3/coins/stkfury"
      );
      if (res && res.data) {
        stkFuryPrice = res.data.market_data.current_price.usd;
      }

      const secretjs = new SecretNetworkClient({
        url: SHADE_LCD,
        chainId: "secret-4"
      });

      const result: any = await secretjs.query.compute.queryContract({
        contract_address: "secret1qxk2scacpgj2mmm0af60674afl9e6qneg7yuny",
        query: { vault: { vault_id: "10" } }
      });
      if (result) {
        return {
          total_supply:
            Number(decimalizeRaw(result.vault.collateral.base!, 18)) *
            stkFuryPrice,
          fees: Number(result.vault.config.fees.borrow_fee.delta) * 100
        };
      }
      return initialTVLAPY;
    } catch (e) {
      const customScope = new Scope();
      customScope.setLevel("fatal");
      customScope.setTags({
        "Error fetching info from secret": SHADE_LCD
      });
      genericErrorHandler(e, customScope);
      return initialTVLAPY;
    }
  };

export const getAvatar = async (identity: string) => {
  try {
    const urlLink =
      "https://keybase.io/_/api/1.0/user/lookup.json" +
      `?key_suffix=${identity}&fields=pictures`;
    const res = await Axios.get(urlLink, { timeout: 3000 });
    const url = res?.data?.them[0]?.pictures?.primary?.url;
    if (url) {
      return url;
    }
    return "/images/profile.svg"; // return profile icon if url not exists
  } catch (e) {
    return "/images/profile.svg";
  }
};
