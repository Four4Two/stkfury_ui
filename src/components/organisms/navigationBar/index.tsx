import React, { useEffect } from "react";
import LoginOptions from "./loginOptions";
import Button from "../../atoms/button";
import {
  DEV_NET,
  MID_INTERVAL,
  SHORT_INTERVAL,
  TEST_NET
} from "../../../../AppConstants";
import { Icon } from "../../atoms/icon";
import { useDispatch, useSelector } from "react-redux";
import { showMobileSidebar } from "../../../store/reducers/sidebar";
import Link from "next/link";
import { useWindowSize } from "../../../customHooks/useWindowSize";
import { useWallet } from "../../../context/WalletConnect/WalletConnect";
import { fetchBalanceSaga } from "../../../store/reducers/balances";
import { fetchInitSaga } from "../../../store/reducers/initialData";
import { RootState } from "../../../store/reducers";
import { useRouter } from "next/router";
import { fetchLiveDataSaga } from "../../../store/reducers/liveData";
import { fetchPendingClaimsSaga } from "../../../store/reducers/claim";
import { fetchTokenizeSharesSaga } from "../../../store/reducers/transactions/stake";

const NavigationBar = () => {
  const dispatch = useDispatch();
  const { isMobile } = useWindowSize();
  const router = useRouter();
  const handleMenu = () => {
    dispatch(showMobileSidebar());
  };

  const {
    isWalletConnected,
    persistenceAccountData,
    furyAccountData,
    furyChainData,
    persistenceChainData
  } = useWallet();

  const { furyBalances, persistenceBalances } = useSelector(
    (state: RootState) => state.balances
  );

  const { persistenceChainStatus } = useSelector(
    (state: RootState) => state.liveData
  );

  // fetch call on every 10 sec
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(
        fetchLiveDataSaga({
          persistenceChainInfo: persistenceChainData!,
          furyChainInfo: furyChainData!
        })
      );
    }, SHORT_INTERVAL);
    return () => clearInterval(interval);
  }, [dispatch, persistenceChainData, furyChainData]);

  // fetch call on every 3min sec
  useEffect(() => {
    const interval = setInterval(() => {
      if (isWalletConnected) {
        dispatch(
          fetchPendingClaimsSaga({
            address: persistenceAccountData!.address,
            persistenceChainInfo: persistenceChainData!,
            dstChainInfo: furyChainData!
          })
        );
        dispatch(
          fetchInitSaga({
            persistenceChainInfo: persistenceChainData!,
            furyChainInfo: furyChainData!
          })
        );
        dispatch(
          fetchBalanceSaga({
            persistenceAddress: persistenceAccountData!.address,
            furyAddress: furyAccountData!.address,
            persistenceChainInfo: persistenceChainData!,
            furyChainInfo: furyChainData!
          })
        );
      }
    }, MID_INTERVAL);
    return () => clearInterval(interval);
  }, [
    persistenceAccountData,
    furyAccountData,
    isWalletConnected,
    dispatch,
    persistenceChainData,
    furyChainData
  ]);

  useEffect(() => {
    if (
      isWalletConnected &&
      (furyBalances.balances.length > 0 ||
        persistenceBalances.balances.length > 0)
    ) {
      dispatch(
        fetchTokenizeSharesSaga({
          address: persistenceAccountData!.address,
          dstAddress: furyAccountData!.address,
          srcChain: persistenceChainData!,
          dstChain: furyChainData!,
          srcChainBalances: persistenceBalances,
          dstChainBalances: furyBalances
        })
      );
    }
  }, [isWalletConnected, furyBalances, persistenceBalances]);

  if (
    persistenceChainStatus ||
    process.env.NEXT_PUBLIC_MAINTENANCE === "true"
  ) {
    router.push("/maintenance");
  }

  return (
    <div>
      <div className="block mb-10 pt-4 py-6 pl-7 pr-14 md:px-3">
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
            <div className="pl-4">
              <LoginOptions />
            </div>
            <button className="md:block hidden pl-2" onClick={handleMenu}>
              <Icon iconName="menu" viewClass="menu" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;
