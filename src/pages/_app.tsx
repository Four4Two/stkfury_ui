import "../styles/globals.css";
import type { AppProps } from "next/app";
import { CHAIN_ID, ExternalChains } from "../helpers/config";
import WalletProvider from "../context/WalletConnect/WalletConnect";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { store } from "../store";
import { Provider } from "react-redux";
import { ChainInfo } from "@keplr-wallet/types";
import Maintenance from "./maintenance";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import TermsModal from "../components/organisms/termsModal";
import React from "react";

function MyApp({ Component, pageProps }: AppProps) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    integrations: [new Integrations.BrowserTracing()],

    tracesSampleRate: 1.0 //lower the value in production
  });

  const env: string = process.env.NEXT_PUBLIC_ENVIRONMENT!;

  let persistenceChainInfo = ExternalChains[env].find(
    (chain: ChainInfo) => chain.chainId === CHAIN_ID[env].persistenceChainID
  );

  let cosmosChainInfo = ExternalChains[env].find(
    (chain: ChainInfo) => chain.chainId === CHAIN_ID[env].cosmosChainID
  );

  return (
    <Provider store={store}>
      <TermsModal />
      <ToastContainer
        position="top-right"
        autoClose={3000}
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
        {process.env.NEXT_PUBLIC_MAINTENANCE === "true" ? (
          <Maintenance />
        ) : (
          <Component {...pageProps} />
        )}
      </WalletProvider>
    </Provider>
  );
}

export default MyApp;
