export const defiSwapList = (osmosisInfo, crescentInfo) => [
  {
    id: 0,
    inputToken: "stkATOM",
    inputToken_logo: "/images/tokens/stk_atom.svg",
    outputToken: "ATOM",
    outputToken_logo: "/images/tokens/atom.svg",
    platform: "Osmosis",
    platform_logo: "/images/defi/osmosis.svg",
    swap_fee: "-",
    apr: "--",
    value_locked: "12321",
    swap_link: "https://frontier.osmosis.zone/?from=stkATOM&to=ATOM",
    pool_link: "https://frontier.osmosis.zone/pool/886",
    launched: true,
    type: "defi",
    tvl: 0,
    apy: 0,
    pool_liquidity: osmosisInfo.pool_liquidity,
    fees: osmosisInfo.fees
  },
  {
    id: 1,
    inputToken: "stkATOM",
    inputToken_logo: "/images/tokens/stk_atom.svg",
    outputToken: "ATOM",
    outputToken_logo: "/images/tokens/atom.svg",
    platform: "Crescent",
    platform_logo: "/images/defi/crescent.svg",
    swap_fee: "-",
    apr: "--",
    value_locked: "12321",
    swap_link: "https://app.crescent.network/swap?from=stkatom&to=atom",
    pool_link: "https://app.crescent.network/farm",
    launched: true,
    type: "defi",
    pool_liquidity: crescentInfo.tvl,
    apy: crescentInfo.total_apy,
    fees: 0
  }
];

export const defiBorrowLendingList = [];
