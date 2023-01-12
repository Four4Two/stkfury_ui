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
import Head from "next/head";

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
    <>
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicons/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicons/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicons/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/favicons/safari-pinned-tab.svg"
          color="#5bbad5"
        />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta charSet="utf-8" />
        <link rel="shortcut icon" href="/favicons/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Liquid Staking for The Internet of Blockchains"
        />
        <meta
          name="keywords"
          content="liquid staking, pstake, $pstake, cosmos, persistence, xprt, atom"
        />
        {/*Open Graph Tags*/}
        <meta content="pSTAKE | ATOM Liquid Staking" property="og:title" />
        <meta property="og:image" content="/og.jpg" />
        <meta
          property="og:description"
          content="Liquid Staking for The Internet of Blockchains"
        />
        {/*Twitter Tags*/}
        <meta content="pSTAKE | ATOM Liquid Staking" property="twitter:title" />
        <meta
          content="Liquid Staking for The Internet of Blockchains"
          property="twitter:description"
        />
        <meta content="/ogimage.jpeg" property="twitter:image" />
        <title>pSTAKE | ATOM Liquid Staking</title>
      </Head>
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
    </>
  );
}

export default MyApp;
