import React from "react";
import styles from "../defi/styles.module.css";
import { useWallet } from "../../../context/WalletConnect/WalletConnect";

const TransactionsTable = () => {
  const { persistenceAccountData } = useWallet();
  return (
    <div className={`${styles.defiContainer} px-2 pb-10 m-auto md:px-3`}>
      <div className="mb-8">
        <h1
          className="text-4xl font-semibold leading-normal
                text-light-high text-center md:text-lg mb-8"
        >
          Transaction History
        </h1>
        <div className="bg-[#161616] py-8 px-12 rounded-md md:py-3 md:px-4">
          <p className="text-base text-light-mid leading-normal font-normal text-center">
            Coming soon - please temporarily refer to&nbsp;
            <a
              href={`https://www.mintscan.io/persistence/account/${persistenceAccountData?.address}`}
              className="text-[#0d6efd]"
              target="_blank"
              rel="noreferrer"
            >
              the explorer
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransactionsTable;
