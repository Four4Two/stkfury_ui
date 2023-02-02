import { cosmos, InstallError } from "@cosmostation/extension-client";
import { ChainInfo } from "@keplr-wallet/types";
import { getOfflineSigner } from "@cosmostation/cosmos-client";

export const CosmosStationWallet = async (chain: ChainInfo) => {
  console.log("chian", "eherer", chain);
  try {
    const provider = await cosmos();
    const supportedChains = await provider.getSupportedChains();
    if (
      !supportedChains.official.includes(chain.chainName.toLowerCase()) ||
      !supportedChains.unofficial.includes(chain.chainName.toLowerCase())
    ) {
      await provider.addChain({
        chainId: chain.chainId,
        chainName: chain.chainName,
        addressPrefix: chain.bech32Config.bech32PrefixAccAddr,
        baseDenom: chain.stakeCurrency.coinMinimalDenom,
        displayDenom: chain.stakeCurrency.coinDenom,
        restURL: chain.rest,
        coinType: "118", // optional (default: '118')
        decimals: chain.stakeCurrency.coinDecimals, // optional (default: 6)
        gasRate: {
          // optional (default: { average: '0.025', low: '0.0025', tiny: '0.00025' })
          average: "0.2",
          low: "0.02",
          tiny: "0.002"
        },
        sendGas: "80000", // optional (default: '100000')
        type: "" // optional (default: '')
      });
    }
    const account = await provider.requestAccount(
      chain.bech32Config.bech32PrefixAccAddr
    );
    console.log(account);
    return await getOfflineSigner(chain.chainId);
  } catch (e) {
    if (e instanceof InstallError) {
      console.log("not installed");
    }
  }
};

export default CosmosStationWallet;
