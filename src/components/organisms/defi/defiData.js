export const defiSwapList = (osmosisInfo) => [
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
  }
];

export const defiBorrowLendingList = [];
