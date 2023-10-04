import React from "react";
import { InitialTvlApyFeeTypes } from "../../../store/reducers/initialData/types";

export type AvailableDefiOption = "dexList" | "blList";

export interface DefiInfo {
  id: number;
  token0: string;
  token1: string;
  token0_logo: string;
  token1_logo: string;
  platform: string;
  platform_logo: string;
  button_one_text?: string;
  button_one_url?: string;
  button_two_text?: string;
  button_two_url?: string;
  launched: boolean;
  apy?: number | string | React.ReactNode;
  tvl?: number | string | React.ReactNode;
  fee?: number | string | React.ReactNode;
  borrow_apy?: number | string | React.ReactNode;
  total_supply?: number | string | React.ReactNode;
  lending_apy?: number | string | React.ReactNode;
  type: AvailableDefiOption;
}

export type DefiDataList = {
  [key in AvailableDefiOption]: DefiInfo[];
};

export const defiDataList = (
  osmosisInfo: InitialTvlApyFeeTypes,
  crescentInfo: InitialTvlApyFeeTypes,
  dexterInfo: InitialTvlApyFeeTypes,
  umeeInfo: InitialTvlApyFeeTypes,
  shadeFuryStkFury: InitialTvlApyFeeTypes,
  shadeStkFURYSilk: InitialTvlApyFeeTypes,
  shadeCollateral: InitialTvlApyFeeTypes
): DefiDataList => {
  return {
    dexList: [
      {
        id: 1,
        token0: "stkFURY",
        token0_logo: "/images/tokens/stk_fury.svg",
        token1: "FURY",
        token1_logo: "/images/tokens/fury.svg",
        platform: "Osmosis",
        platform_logo: "/images/defi/osmosis.svg",
        button_one_text: "Swap",
        button_one_url: "https://app.osmosis.zone/?from=stkFURY&to=FURY",
        button_two_text: "Add Liquidity",
        button_two_url: "https://app.osmosis.zone/pool/886",
        launched: true,
        apy: osmosisInfo.total_apy,
        tvl: osmosisInfo.tvl,
        fee: osmosisInfo.fees,
        type: "dexList"
      },
      {
        id: 1,
        token0: "stkFURY",
        token0_logo: "/images/tokens/stk_fury.svg",
        token1: "FURY",
        token1_logo: "/images/tokens/fury.svg",
        platform: "Crescent",
        platform_logo: "/images/defi/crescent.svg",
        button_one_text: "Swap",
        button_one_url:
          "https://app.crescent.network/swap?from=stkfury&to=fury",
        button_two_text: "Add Liquidity",
        button_two_url:
          "https://app.crescent.network/farm?open_modal_pool_id=57",
        launched: true,
        apy: crescentInfo.total_apy,
        tvl: crescentInfo.tvl,
        fee: "0%",
        type: "dexList"
      },
      {
        id: 0,
        token0: "stkFURY",
        token0_logo: "/images/tokens/stk_fury.svg",
        token1: "FURY",
        token1_logo: "/images/tokens/fury.svg",
        platform: "Dexter",
        platform_logo: "/images/defi/dexter.svg",
        button_one_text: "Swap",
        button_one_url: "https://app.dexter.zone/?from=stkFURY&to=FURY",
        button_two_text: "Add Liquidity",
        button_two_url:
          "https://app.dexter.zone/pools/persistence1335rlmhujm0gj5e9gh7at9jpqvqckz0mpe4v284ar4lw5mlkryzszkpfrs",
        launched: true,
        apy: dexterInfo.total_apy,
        tvl: dexterInfo.tvl,
        fee: dexterInfo.fees,
        type: "dexList"
      },
      {
        id: 4,
        token0: "stkFURY",
        token0_logo: "/images/tokens/stk_fury.svg",
        token1: "FURY",
        token1_logo: "/images/tokens/fury.svg",
        platform: "Shade",
        platform_logo: "/images/defi/shade.svg",
        button_one_text: "Swap",
        button_one_url:
          "https://app.shadeprotocol.io/swap?input=stkFURY&output=FURY",
        button_two_text: "Add Liquidity",
        button_two_url: "https://app.shadeprotocol.io/swap/pools",
        launched: true,
        apy: shadeFuryStkFury.total_apy,
        tvl: shadeFuryStkFury.tvl,
        fee: `${shadeFuryStkFury.fees}%`,
        type: "dexList"
      },
      {
        id: 5,
        token0: "stkFURY",
        token0_logo: "/images/tokens/stk_fury.svg",
        token1: "SILK",
        token1_logo: "/images/tokens/silk.svg",
        platform: "Shade",
        platform_logo: "/images/defi/shade.svg",
        button_one_text: "Swap",
        button_one_url:
          "https://app.shadeprotocol.io/swap?input=stkFURY&output=SILK",
        button_two_text: "Add Liquidity",
        button_two_url: "https://app.shadeprotocol.io/swap/pools",
        launched: true,
        apy: shadeStkFURYSilk.total_apy,
        tvl: shadeStkFURYSilk.tvl,
        fee: `${shadeStkFURYSilk.fees}%`,
        type: "dexList"
      }
    ],
    blList: [
      {
        id: 3,
        token0: "stkFURY",
        token0_logo: "/images/tokens/stk_fury.svg",
        token1: "FURY",
        token1_logo: "/images/tokens/fury.svg",
        platform: "Umee",
        platform_logo: "/images/defi/umee.svg",
        button_one_text: "Add Collateral",
        button_one_url: "https://app.umee.cc/#/markets",
        button_two_text: "Borrow",
        button_two_url: "https://app.umee.cc/#/markets",
        launched: true,
        borrow_apy: umeeInfo.borrow_apy,
        lending_apy: umeeInfo.lending_apy,
        total_supply: umeeInfo.total_supply,
        fee: 0,
        type: "blList"
      },
      {
        id: 3,
        token0: "stkFURY",
        token0_logo: "/images/tokens/stk_fury.svg",
        token1: "SILK",
        token1_logo: "/images/tokens/silk.svg",
        platform: "Shade",
        platform_logo: "/images/defi/shade.svg",
        button_one_text: "Add Collateral",
        button_one_url: "https://app.shadeprotocol.io/borrow",
        button_two_text: "Borrow",
        button_two_url: "https://app.shadeprotocol.io/borrow",
        launched: true,
        borrow_apy: 0,
        lending_apy: 0,
        total_supply: shadeCollateral.total_supply,
        fee: shadeCollateral.fees,
        type: "blList"
      }
    ]
  };
};
