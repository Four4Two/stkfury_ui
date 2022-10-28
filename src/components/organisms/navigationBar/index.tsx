import React, { useEffect } from "react";
import LoginOptions from "./loginOptions";
import Button from "../../atoms/button";
import { DEV_NET, SHORT_INTERVAL, TEST_NET } from "../../../../AppConstants";
import { Icon } from "../../atoms/icon";
import { useDispatch, useSelector } from "react-redux";
import { showMobileSidebar } from "../../../store/reducers/sidebar";
import Link from "next/link";
import { useWindowSize } from "../../../customHooks/useWindowSize";
import { useWallet } from "../../../context/WalletConnect/WalletConnect";
import { fetchBalanceSaga } from "../../../store/reducers/balances";
import { fetchPendingClaimsSaga } from "../../../store/reducers/claim";
import { fetchInitSaga } from "../../../store/reducers/initialData";
import { RootState } from "../../../store/reducers";
import { useRouter } from "next/router";

const NavigationBar = () => {
  const dispatch = useDispatch();
  const { isMobile } = useWindowSize();

  const handleMenu = () => {
    dispatch(showMobileSidebar());
  };

  const {
    isWalletConnected,
    persistenceAccountData,
    cosmosAccountData,
    cosmosChainData,
    persistenceChainData
  } = useWallet();

  useEffect(() => {
    const interval = setInterval(() => {
      if (isWalletConnected) {
        dispatch(
          fetchBalanceSaga({
            persistenceAddress: persistenceAccountData!.address,
            cosmosAddress: cosmosAccountData!.address,
            persistenceChainInfo: persistenceChainData!,
            cosmosChainInfo: cosmosChainData!
          })
        );
        dispatch(
          fetchPendingClaimsSaga({
            address: persistenceAccountData!.address,
            persistenceChainInfo: persistenceChainData!
          })
        );
        dispatch(
          fetchInitSaga({
            persistenceChainInfo: persistenceChainData!,
            cosmosChainInfo: cosmosChainData!
          })
        );
      }
    }, SHORT_INTERVAL);
    return () => clearInterval(interval);
  }, [
    isWalletConnected,
    dispatch,
    persistenceAccountData,
    cosmosAccountData,
    persistenceChainData,
    cosmosChainData
  ]);

  const { cosmosChainStatus, persistenceChainStatus } = useSelector(
    (state: RootState) => state.initialData
  );
  const router = useRouter();

  useEffect(() => {
    if (cosmosChainStatus || persistenceChainStatus) {
      console.log("chain halted");
    }
  }, [router, cosmosChainStatus, persistenceChainStatus]);

  return (
    <div className="flex mb-10 py-6 px-7 md:px-3">
      <div className="flex items-center flex-1">
        <div className="hidden md:block">
          <Link href="/" className="nav-link" passHref>
            <img
              src={"/images/logo.svg"}
              alt={"logo"}
              width={isMobile ? 90 : 124}
            />
          </Link>
        </div>
        <div className="flex ml-auto">
          <Button
            size="medium"
            type="custom"
            content={
              <div className="flex items-center">
                <div className="flex items-center">
                  <img
                    src={"/images/persistence_icon.svg"}
                    alt={"logo"}
                    width={18}
                    height={18}
                  />
                  <span className="ml-3">
                    {process.env.NEXT_PUBLIC_ENVIRONMENT === TEST_NET
                      ? "Persistence Testnet"
                      : process.env.NEXT_PUBLIC_ENVIRONMENT === DEV_NET
                      ? "Persistence Devnet"
                      : "Persistence Mainnet"}
                  </span>
                </div>
              </div>
            }
            className="button custom lg:!hidden pointer-events-none !text-sm"
          />
          <div className="pl-5">
            <LoginOptions />
          </div>
          <button className="md:block hidden pl-2" onClick={handleMenu}>
            <Icon iconName="menu" viewClass="menu" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;
