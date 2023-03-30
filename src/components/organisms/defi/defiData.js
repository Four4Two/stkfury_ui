export const defiSwapList = (osmosisInfo, crescentInfo, dexterInfo) => [
  {
    id: 1,
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
    apy: osmosisInfo.total_apy,
    pool_liquidity: osmosisInfo.tvl,
    fees: osmosisInfo.fees
  },
  {
    id: 2,
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
  },
  {
    id: 0,
    inputToken: "stkATOM",
    inputToken_logo: "/images/tokens/stk_atom.svg",
    outputToken: "ATOM",
    outputToken_logo: "/images/tokens/atom.svg",
    platform: "Dexter",
    platform_logo: "/images/defi/dexter.svg",
    swap_fee: "-",
    swap_link: "https://app.dexter.zone/",
    pool_link:
      "https://app.dexter.zone/pools/persistence1335rlmhujm0gj5e9gh7at9jpqvqckz0mpe4v284ar4lw5mlkryzszkpfrs",
    launched: true,
    type: "defi",
    pool_liquidity: dexterInfo.tvl,
    apy: dexterInfo.total_apy,
    fees: "0.3%"
  }
];

export const defiBorrowLendingList = [];
