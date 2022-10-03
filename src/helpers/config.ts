import {IBCChainInfo} from "../context/WalletConnect/types";
import {ChainInfo} from "@keplr-wallet/types";

interface ExternalChainData {
    [index: string]: ChainInfo[];
}

export type IBCChainData = {
    [index: string]: IBCChainInfo[]
}

export const GasInfo = {
    gas: 250000,
    minGas: 80000,
    maxGas: 2000000,
};

export const FeeInfo = {
    lowFee: 0,
    averageFee: 0.025,
    highFee: 0.04,
    defaultFee: "5000",
    vestingAccountFee: "0",
};

export const IBCConfiguration = {
    timeoutTimestamp: 1000,
    ibcRevisionHeightIncrement: 1000,
    ibcRemoteHeightIncrement: 150,
    ibcDefaultPort: "transfer",
};


export const IBCChainInfos:IBCChainData = {
    Testnet: [
        {
            counterpartyChainId: 'gaiad-1',
            chainName: 'Cosmos Testnet',
            sourceChannelId: 'channel-0',
            destinationChannelId: '',
            portID: 'transfer',
            coinDenom: 'ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2',
            prefix: 'cosmos'
        }
    ],
    Mainnet: [
        {
            counterpartyChainId: 'cosmoshub-4',
            chainName: 'Cosmos Hub',
            sourceChannelId: 'channel-190',
            destinationChannelId: 'channel-24',
            portID: 'transfer',
            coinDenom: 'uatom',
            prefix: 'cosmos'
        },
    ]
}

export const ExternalChains:ExternalChainData = {
    Testnet: [
        {
            rpc: 'https://rpc.devnet.persistence.pstake.finance',
            rest: 'https://rest.devnet.persistence.pstake.finance',
            chainId: 'pstaked-1',
            chainName: 'pStake Persistence Devnet',
            stakeCurrency: {
                coinDenom: 'XPRT',
                coinMinimalDenom: 'uxprt',
                coinDecimals: 6,
                coinGeckoId: 'persistence',
                coinImageUrl:'/images/tokens/xprt_logo.svg',
            },
            bip44: {
                coinType: 118,
            },
            currencies: [
                {
                    coinDenom: 'XPRT',
                    coinMinimalDenom: 'uxprt',
                    coinDecimals: 6,
                    coinGeckoId: 'persistence',
                    coinImageUrl: '/images/tokens/xprt_logo.svg',
                },
                {
                    coinDenom: 'STKATOM',
                    coinMinimalDenom: 'ustkatom',
                    coinDecimals: 6,
                    // coinGeckoId: '',
                    coinImageUrl:'/images/tokens/stk_atom.svg',
                }
            ],
            feeCurrencies: [
                {
                    coinDenom: 'XPRT',
                    coinMinimalDenom: 'uxprt',
                    coinDecimals: 6,
                    coinGeckoId: 'persistence',
                    coinImageUrl:'/images/tokens/xprt_logo.svg',
                },
            ],
            bech32Config:{
                bech32PrefixAccAddr: 'persistence',
                bech32PrefixAccPub: "persistencepub",
                bech32PrefixValAddr: "persistencevaloper",
                bech32PrefixValPub: "persistencevaloperpub",
                bech32PrefixConsAddr: "persistencevalcons",
                bech32PrefixConsPub: "persistencevalconspub"
            }
        },
        {
            rpc: 'https://rpc.devnet.cosmos.pstake.finance',
            rest: 'https://rest.devnet.cosmos.pstake.finance',
            chainId: 'gaiad-1',
            chainName: 'pStake Cosmos Devnet',
            stakeCurrency: {
                coinDenom: 'ATOM',
                coinMinimalDenom: 'uatom',
                coinDecimals: 6,
                coinGeckoId: 'cosmos',
                coinImageUrl: '/images/tokens/atom.svg',
            },
            bip44: {
                coinType: 118,
            },
            currencies: [
                {
                    coinDenom: 'ATOM',
                    coinMinimalDenom: 'uatom',
                    coinDecimals: 6,
                    coinGeckoId: 'cosmos',
                    coinImageUrl: '/images/tokens/atom.svg',
                },
            ],
            feeCurrencies: [
                {
                    coinDenom: 'ATOM',
                    coinMinimalDenom: 'uatom',
                    coinDecimals: 6,
                    coinGeckoId: 'cosmos',
                    coinImageUrl: '/images/tokens/atom.svg',
                },
            ],
            bech32Config:{
                bech32PrefixAccAddr: 'cosmos',
                bech32PrefixAccPub: "cosmospub",
                bech32PrefixValAddr: "cosmosvaloper",
                bech32PrefixValPub: "cosmosvaloperpub",
                bech32PrefixConsAddr: "cosmosvalcons",
                bech32PrefixConsPub: "persistencevalconspub"
            }
        },
    ],
    Mainnet: [
        {
            rpc: 'https://rpc.cosmoshub-4.audit.one/',
            rest: 'https://rpc.cosmoshub-4.audit.one/',
            chainId: 'cosmoshub-4',
            chainName: 'Cosmos Hub',
            stakeCurrency: {
                coinDenom: 'ATOM',
                coinMinimalDenom: 'uatom',
                coinDecimals: 6,
                coinGeckoId: 'cosmos',
                coinImageUrl: '/images/tokens/atom.svg',
            },
            bip44: {
                coinType: 118,
            },
            currencies: [
                {
                    coinDenom: 'ATOM',
                    coinMinimalDenom: 'uatom',
                    coinDecimals: 6,
                    coinGeckoId: 'cosmos',
                    coinImageUrl:  '/images/tokens/atom.svg',
                },
            ],
            feeCurrencies: [
                {
                    coinDenom: 'ATOM',
                    coinMinimalDenom: 'uatom',
                    coinDecimals: 6,
                    coinGeckoId: 'cosmos',
                    coinImageUrl: '/images/tokens/atom.svg',
                },
            ],
            bech32Config:{
                bech32PrefixAccAddr: 'cosmos',
                bech32PrefixAccPub: "cosmospub",
                bech32PrefixValAddr: "cosmosvaloper",
                bech32PrefixValPub: "cosmosvaloperpub",
                bech32PrefixConsAddr: "cosmosvalcons",
                bech32PrefixConsPub: "persistencevalconspub"
            }
        },
        {
            rpc: 'https://rpc.core.persistence.one/',
            rest: 'https://rpc.core.persistence.one/',
            chainId: 'core-1',
            chainName: 'Persistence',
            stakeCurrency: {
                coinDenom: 'XPRT',
                coinMinimalDenom: 'uxprt',
                coinDecimals: 6,
                coinGeckoId: 'persistence',
                coinImageUrl:'/images/tokens/xprt_logo.svg',
            },
            bip44: {
                coinType: 750,
            },
            currencies: [
                {
                    coinDenom: 'XPRT',
                    coinMinimalDenom: 'uxprt',
                    coinDecimals: 6,
                    coinGeckoId: 'persistence',
                    coinImageUrl: '/images/tokens/xprt_logo.svg',
                }
            ],
            feeCurrencies: [
                {
                    coinDenom: 'XPRT',
                    coinMinimalDenom: 'uxprt',
                    coinDecimals: 6,
                    coinGeckoId: 'persistence',
                    coinImageUrl: '/images/tokens/xprt_logo.svg',
                },
            ],
            bech32Config:{
                bech32PrefixAccAddr: 'persistence',
                bech32PrefixAccPub: "persistencepub",
                bech32PrefixValAddr: "persistencevaloper",
                bech32PrefixValPub: "persistencevaloperpub",
                bech32PrefixConsAddr: "persistencevalcons",
                bech32PrefixConsPub: "persistencevalconspub"
            }
        },
    ]
}

export const PollingConfig = {
    "initialTxHashQueryDelay": 10000,
    "scheduledTxHashQueryDelay": 10000,
    "numberOfRetries": 60,
}
