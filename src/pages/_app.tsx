import '../styles/globals.css'
import type {AppProps} from 'next/app'
import {ExternalChains} from "../helpers/config";
import {COSMOS_CHAIN_ID, PERSISTENCE_CHAIN_ID} from "../../AppConstants";
import WalletProvider from "../context/WalletConnect/WalletConnect";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Flowbite } from 'flowbite-react';
import { store } from "../store"
import {Provider} from "react-redux";

function MyApp({Component, pageProps}: AppProps) {
  // type ss = typeItems
  //   let env:typeItems = process.env.REACT_APP_ENVIRONMENT!;
    let persistenceChainInfo = ExternalChains['Testnet'].find((chain) => chain.chainId === PERSISTENCE_CHAIN_ID);
    let cosmosChainInfo= ExternalChains['Testnet'].find((chain) => chain.chainId === COSMOS_CHAIN_ID);
  return (
    <Provider store={store}>
      <Flowbite>
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
      </Flowbite>
    </Provider>
  )
}

export default MyApp