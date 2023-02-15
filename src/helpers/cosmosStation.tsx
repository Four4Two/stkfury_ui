import { ChainInfo } from "@keplr-wallet/types";

declare global {
  interface Window {
    cosmostation?: any;
  }
}

const CosmosStationWallet = async (chain: ChainInfo) => {
  if (!window.cosmostation) {
    throw new Error("Please install cosmostation extension");
  } else {
    if (window.cosmostation!.providers.keplr.experimentalSuggestChain) {
      try {
        await window.cosmostation!.providers.keplr.experimentalSuggestChain({
          // Chain-id of the Cosmos SDK chain.
          chainId: chain.chainId,
          // The name of the chain to be displayed to the user.
          chainName: chain.chainName,
          // RPC endpoint of the chain.
          rpc: chain.rpc,
          // REST endpoint of the chain.
          rest: chain.rest,
          // Staking coin information
          stakeCurrency: chain.stakeCurrency,
          // (Optional) If you have a wallet webpage used to stake the coin then provide the url to the website in `walletUrlForStaking`.
          // The 'stake' button in Keplr extension will link to the webpage.
          walletUrlForStaking: `http://localhost:3000`,
          // The BIP44 path.
          bip44: {
            // You can only set the coin type of BIP44.
            // 'Purpose' is fixed to 44.
            coinType: chain.bip44.coinType
          },
          // Bech32 configuration to show the address to user.
          // This field is the interface of
          // {
          //   bech32PrefixAccAddr: string;
          //   bech32PrefixAccPub: string;
          //   bech32PrefixValAddr: string;
          //   bech32PrefixValPub: string;
          //   bech32PrefixConsAddr: string;
          //   bech32PrefixConsPub: string;
          // }
          bech32Config: chain.bech32Config,
          // List of all coin/tokens used in this chain.
          currencies: chain.currencies,
          // List of coin/tokens used as a fee token in this chain.
          feeCurrencies: chain.feeCurrencies,
          // (Optional) The number of the coin type.
          // This field is only used to fetch the address from ENS.
          // Ideally, it is recommended to be the same with BIP44 path's coin type.
          // However, some early chains may choose to use the Cosmos Hub BIP44 path of '118'.
          // So, this is separated to support such chains.
          coinType: chain.bip44.coinType,
          // (Optional) This is used to set the fee of the transaction.
          // If this field is not provided, Keplr extension will set the default gas price as (low: 0.01, average: 0.025, high: 0.04).
          // Currently, Keplr doesn't support dynamic calculation of the gas prices based on on-chain data.
          // Make sure that the gas prices are higher than the minimum gas prices accepted by chain validators and RPC/REST endpoint.
          gasPriceStep: chain.gasPriceStep,
          features: ["ibc-transfer", "ibc-go"]
        });
      } catch {
        throw new Error("Failed to suggest the chain");
      }
    }
    await window.cosmostation!.providers.keplr.enable(chain.chainId);
    const offlineSigner = window.cosmostation!.providers.keplr.getOfflineSigner(
      chain.chainId
    );
    const accounts = await offlineSigner.getAccounts();
    return offlineSigner;
  }
};

export default CosmosStationWallet;
