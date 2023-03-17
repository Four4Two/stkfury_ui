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
    swap_link: "https://app.osmosis.zone/?from=stkATOM&to=ATOM",
    pool_link: "https://app.osmosis.zone/pool/886",
    launched: true,
    type: "defi",
    apy: "21.1",
    pool_liquidity: osmosisInfo.tvl,
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
    swap_link: "https://app.crescent.network/swap?from=stkatom&to=atom",
    pool_link: "https://app.crescent.network/farm?open_modal_pool_id=57",
    launched: true,
    type: "defi",
    pool_liquidity: crescentInfo.tvl,
    apy: crescentInfo.total_apy,
    fees: "0%"
  }
];

export const defiBorrowLendingList = [];
