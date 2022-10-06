import React, {useEffect, useState} from "react";
import styles from "./styles.module.css"
import TabItem from "../../../molecules/tabs/tabItem";
import TabContent from "../../../molecules/tabs/tabContent";
import Stake from "../stake";
import UnStake from "../unstake";
import Claim from "../claim";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/reducers";

const StakingTabs = () => {
  const [activeTab, setActiveTab] = useState("Stake")
    const [activeClaims, setActiveClaims] = useState(0);
    const [pendingList, setPendingList] = useState<any>([]);

    const {claimableBalance, pendingClaimList, claimableStkAtomBalance} = useSelector((state:RootState) => state.claimQueries);

    useEffect(()=>{
        setActiveClaims(claimableBalance)
        setPendingList(pendingClaimList)
    },[claimableBalance, pendingClaimList])

  const tabItemClasses = 'cursor-pointer w-full bg-tabHeader ' +
    'font-semibold text-lg leading-normal text-center' +
    ' text-light-mid flex-1 px-4 py-2 md:px-2 md:py-1.5 md:text-base';

  return (
    <div className={`${styles.tabsContainer} max-w-[616px] m-auto px-10 pb-10 md:px-3`}>
      <ul className="tabsHeaderList flex flex-wrap mb-4">
        <TabItem id="Stake" title={"Stake"} activeTab={activeTab} className={tabItemClasses} setActiveTab={setActiveTab}/>
        <TabItem id="Unstake" title={"Unstake"} activeTab={activeTab} className={tabItemClasses} setActiveTab={setActiveTab}/>
      </ul>
      <div>
        <TabContent id="Stake" activeTab={activeTab} className="p-6 bg-tabContent rounded-md">
          <Stake/>
        </TabContent>
        <TabContent id="Unstake" activeTab={activeTab} className="p-6 bg-tabContent rounded-md">
          <UnStake/>
        </TabContent>
      </div>
        <Claim
            activeClaims={activeClaims}
            pendingList={pendingList}
            claimableStkAtomBalance={claimableStkAtomBalance}
        />
    </div>
  );
};


export default StakingTabs;
