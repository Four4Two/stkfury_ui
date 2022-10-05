import type { NextPage } from "next";
import { useWallet } from "../context/WalletConnect/WalletConnect";
import { PageTemplate } from "../components/templates/template";
import { useEffect } from "react";
import { fetchBalanceSaga } from "../store/reducers/balances";
import { useDispatch } from "react-redux";
import StakingTabs from "../components/organisms/staking/stakingTabs";
import { SHORT_INTERVAL } from "../../AppConstants";
import { printConsole } from "../helpers/utils";

const Home: NextPage = () => {
  const dispatch = useDispatch();
  const {isWalletConnected, persistenceAccountData, cosmosAccountData, cosmosChainData, persistenceChainData } = useWallet()

  useEffect(() => {
    const interval = setInterval(() => {
      if (isWalletConnected) {
        dispatch(fetchBalanceSaga({
          persistenceAddress:persistenceAccountData!.address,
          cosmosAddress: cosmosAccountData!.address,
          persistenceChainInfo: persistenceChainData!,
          cosmosChainInfo: cosmosChainData!
        }));
      }
    }, SHORT_INTERVAL)
    return () => clearInterval(interval)

  }, [isWalletConnected, dispatch, persistenceAccountData, cosmosAccountData, persistenceChainData, cosmosChainData])

  return (
    <PageTemplate className="stake" title="Stake">
        <StakingTabs/>
    </PageTemplate>
  );
};

export default Home;

