import '../styles/globals.css'
import type {AppProps} from 'next/app'
import {ExternalChains} from "../helpers/config";
import {COSMOS_CHAIN_ID, PERSISTENCE_CHAIN_ID, TEST_NET} from "../../AppConstants";
import WalletProvider from "../context/WalletConnect/WalletConnect";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { store } from "../store"
import {Provider} from "react-redux";
import {ChainInfo} from "@keplr-wallet/types";

function MyApp({Component, pageProps}: AppProps) {

    const env:string = process.env.NEXT_PUBLIC_ENVIRONMENT!;

    let persistenceChainInfo = ExternalChains[env].find((chain:ChainInfo) => chain.chainId === PERSISTENCE_CHAIN_ID);

    let cosmosChainInfo = ExternalChains[env].find((chain:ChainInfo) => chain.chainId === COSMOS_CHAIN_ID);

  return (
    <Provider store={store}>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <WalletProvider
          persistenceChainInfo={persistenceChainInfo!}
          cosmosChainInfo={cosmosChainInfo!}
        >
          <Component {...pageProps} />
        </WalletProvider>
    </Provider>
  )
}

export default MyApp