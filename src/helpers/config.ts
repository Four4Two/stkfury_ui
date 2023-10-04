import { IBCChainInfo } from "../context/WalletConnect/types";
import { ChainInfo } from "@keplr-wallet/types";

const env: string = process.env.NEXT_PUBLIC_ENVIRONMENT!;

interface ExternalChainData {
  [index: string]: ChainInfo[];
}

export type IBCChainData = {
  [index: string]: IBCChainInfo[];
};

export const GasInfo = {
  gas: 250000,
  minGas: 80000,
  maxGas: 2000000
};

export const FeeInfo = {
  lowFee: 0,
  averageFee: 0.025,
  highFee: 0.04,
  defaultFee: "5000",
  vestingAccountFee: "0"
};

export const IBCConfiguration = {
  timeoutTimestamp: 1000,
  ibcRevisionHeightIncrement: 1000,
  ibcRemoteHeightIncrement: 150,
  ibcDefaultPort: "transfer"
};

export const CHAIN_ID: any = {
  Devnet: {
    furyChainID: "gaiad-1",
    persistenceChainID: "pstaked-1"
  },
  Testnet: {
    furyChainID: "theta-testnet-001",
    persistenceChainID: "test-core-2"
  },
  Mainnet: {
    furyChainID: "highbury_710-1",
    persistenceChainID: "core-1"
  }
};

export const IBCChainInfos: IBCChainData = {
  Devnet: [
    {
      counterpartyChainId: "gaiad-1",
      chainName: "Cosmos Testnet",
      sourceChannelId: "channel-0",
      destinationChannelId: "channel-0",
      portID: "transfer",
      coinDenom:
        "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2",
      prefix: "fury"
    }
  ],
  Testnet: [
    {
      counterpartyChainId: "theta-testnet-001",
      chainName: "pStake Cosmos Testnet",
      sourceChannelId: "channel-2777",
      destinationChannelId: "channel-1",
      portID: "transfer",
      coinDenom:
        "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9",
      prefix: "fury"
    }
  ],
  Mainnet: [
    {
      counterpartyChainId: "highbury_710-1",
      chainName: "Highbury",
      sourceChannelId: "channel-190",
      destinationChannelId: "channel-24",
      portID: "transfer",
      coinDenom:
        "ibc/C8A74ABBE2AF892E15680D916A7C22130585CE5704F9B17A10F184A90D53BECA",
      prefix: "fury"
    }
  ]
};

export const ExternalChains: ExternalChainData = {
  Devnet: [
    {
      rpc: "https://rpc.devnet.persistence.pstake.finance",
      rest: "https://rest.devnet.persistence.pstake.finance",
      chainId: "pstaked-1",
      chainName: "pStake Persistence Devnet",
      stakeCurrency: {
        coinDenom: "XPRT",
        coinMinimalDenom: "uxprt",
        coinDecimals: 6,
        coinGeckoId: "persistence"
      },
      bip44: {
        coinType: 118
      },
      currencies: [
        {
          coinDenom: "XPRT",
          coinMinimalDenom: "uxprt",
          coinDecimals: 6,
          coinGeckoId: "persistence"
        },
        {
          coinDenom: "STKFURY",
          coinMinimalDenom: "stk/ufury",
          coinDecimals: 6,
          coinGeckoId: "persistence"
        },
        {
          coinDenom: "PSTAKE",
          coinMinimalDenom: "PSTAKE",
          coinDecimals: 18,
          coinGeckoId: "pstake"
        }
      ],
      feeCurrencies: [
        {
          coinDenom: "XPRT",
          coinMinimalDenom: "uxprt",
          coinDecimals: 6,
          coinGeckoId: "persistence"
        }
      ],
      bech32Config: {
        bech32PrefixAccAddr: "persistence",
        bech32PrefixAccPub: "persistencepub",
        bech32PrefixValAddr: "persistencevaloper",
        bech32PrefixValPub: "persistencevaloperpub",
        bech32PrefixConsAddr: "persistencevalcons",
        bech32PrefixConsPub: "persistencevalconspub"
      }
    },
    {
      rpc: "https://rpc.devnet.fury.pstake.finance",
      rest: "https://rest.devnet.fury.pstake.finance",
      chainId: "gaiad-1",
      chainName: "pStake Cosmos Devnet",
      stakeCurrency: {
        coinDenom: "FURY",
        coinMinimalDenom: "ufury",
        coinDecimals: 6,
        coinGeckoId: "fury"
      },
      bip44: {
        coinType: 118
      },
      currencies: [
        {
          coinDenom: "FURY",
          coinMinimalDenom: "ufury",
          coinDecimals: 6,
          coinGeckoId: "fury"
        }
      ],
      feeCurrencies: [
        {
          coinDenom: "FURY",
          coinMinimalDenom: "ufury",
          coinDecimals: 6,
          coinGeckoId: "fury"
        }
      ],
      bech32Config: {
        bech32PrefixAccAddr: "fury",
        bech32PrefixAccPub: "furypub",
        bech32PrefixValAddr: "furyvaloper",
        bech32PrefixValPub: "furyvaloperpub",
        bech32PrefixConsAddr: "furyvalcons",
        bech32PrefixConsPub: "persistencevalconspub"
      },
      gasPriceStep: {
        low: 0.0,
        average: 0.0,
        high: 0.0
      }
    }
  ],
  Testnet: [
    {
      rpc: "https://rpc.testnet2.persistence.one",
      rest: "https://rest.testnet2.persistence.one",
      chainId: "test-core-2",
      chainName: "Persistence test-net",
      stakeCurrency: {
        coinDenom: "XPRT",
        coinMinimalDenom: "uxprt",
        coinDecimals: 6,
        coinGeckoId: "persistence"
      },
      bip44: {
        coinType: 118
      },
      currencies: [
        {
          coinDenom: "XPRT",
          coinMinimalDenom: "uxprt",
          coinDecimals: 6,
          coinGeckoId: "persistence"
        },
        {
          coinDenom: "STKFURY",
          coinMinimalDenom: "stk/ufury",
          coinDecimals: 6,
          coinGeckoId: "persistence"
        }
      ],
      feeCurrencies: [
        {
          coinDenom: "XPRT",
          coinMinimalDenom: "uxprt",
          coinDecimals: 6,
          coinGeckoId: "persistence"
        }
      ],
      bech32Config: {
        bech32PrefixAccAddr: "persistence",
        bech32PrefixAccPub: "persistencepub",
        bech32PrefixValAddr: "persistencevaloper",
        bech32PrefixValPub: "persistencevaloperpub",
        bech32PrefixConsAddr: "persistencevalcons",
        bech32PrefixConsPub: "persistencevalconspub"
      },
      gasPriceStep: {
        low: 0.0,
        average: 0.01,
        high: 0.025
      }
    },
    {
      rpc: "https://rpc.sentry-02.theta-testnet.polypore.xyz",
      rest: "https://rest.sentry-02.theta-testnet.polypore.xyz",
      chainId: "theta-testnet-001",
      chainName: "pStake Cosmos Testnet",
      stakeCurrency: {
        coinDenom: "FURY",
        coinMinimalDenom: "ufury",
        coinDecimals: 6,
        coinGeckoId: "fury"
      },
      bip44: {
        coinType: 118
      },
      currencies: [
        {
          coinDenom: "FURY",
          coinMinimalDenom: "ufury",
          coinDecimals: 6,
          coinGeckoId: "fury"
        }
      ],
      feeCurrencies: [
        {
          coinDenom: "FURY",
          coinMinimalDenom: "ufury",
          coinDecimals: 6,
          coinGeckoId: "fury"
        }
      ],
      bech32Config: {
        bech32PrefixAccAddr: "fury",
        bech32PrefixAccPub: "furypub",
        bech32PrefixValAddr: "furyvaloper",
        bech32PrefixValPub: "furyvaloperpub",
        bech32PrefixConsAddr: "furyvalcons",
        bech32PrefixConsPub: "persistencevalconspub"
      }
    }
  ],
  Mainnet: [
    {
      rpc: "https://rpc.furya.io/",
      rest: "https://api-mainnet.furya.io/",
      chainId: "highbury_710-1",
      chainName: "Highbury",
      stakeCurrency: {
        coinDenom: "FURY",
        coinMinimalDenom: "ufury",
        coinDecimals: 6,
        coinGeckoId: "fury"
      },
      bip44: {
        coinType: 118
      },
      currencies: [
        {
          coinDenom: "FURY",
          coinMinimalDenom: "ufury",
          coinDecimals: 6,
          coinGeckoId: "fury"
        }
      ],
      feeCurrencies: [
        {
          coinDenom: "FURY",
          coinMinimalDenom: "ufury",
          coinDecimals: 6,
          coinGeckoId: "fury"
        }
      ],
      bech32Config: {
        bech32PrefixAccAddr: "fury",
        bech32PrefixAccPub: "furypub",
        bech32PrefixValAddr: "furyvaloper",
        bech32PrefixValPub: "furyvaloperpub",
        bech32PrefixConsAddr: "furyvalcons",
        bech32PrefixConsPub: "persistencevalconspub"
      }
    },
    {
      rpc: "https://rpc.core.persistence.one/",
      rest: "https://rest.core.persistence.one/",
      chainId: "core-1",
      chainName: "Persistence",
      stakeCurrency: {
        coinDenom: "XPRT",
        coinMinimalDenom: "uxprt",
        coinDecimals: 6,
        coinGeckoId: "persistence"
      },
      bip44: {
        coinType: 750
      },
      currencies: [
        {
          coinDenom: "XPRT",
          coinMinimalDenom: "uxprt",
          coinDecimals: 6,
          coinGeckoId: "persistence"
        },
        {
          coinDenom: "STKFURY",
          coinMinimalDenom: "stk/ufury",
          coinDecimals: 6,
          coinGeckoId: "persistence"
        }
      ],
      feeCurrencies: [
        {
          coinDenom: "XPRT",
          coinMinimalDenom: "uxprt",
          coinDecimals: 6,
          coinGeckoId: "persistence"
        }
      ],
      bech32Config: {
        bech32PrefixAccAddr: "persistence",
        bech32PrefixAccPub: "persistencepub",
        bech32PrefixValAddr: "persistencevaloper",
        bech32PrefixValPub: "persistencevaloperpub",
        bech32PrefixConsAddr: "persistencevalcons",
        bech32PrefixConsPub: "persistencevalconspub"
      },
      gasPriceStep: {
        low: 0.0,
        average: 0.0,
        high: 0.0
      }
    }
  ]
};

export const PollingConfig = {
  initialTxHashQueryDelay: 5000,
  scheduledTxHashQueryDelay: 5000,
  numberOfRetries: 60
};
