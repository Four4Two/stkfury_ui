import React, {useEffect, useState} from "react";
import styles from "./styles.module.css"
import TabItem from "../../../molecules/tabs/tabItem";
import TabContent from "../../../molecules/tabs/tabContent";
import Stake from "../stake";
import UnStake from "../unstake";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/reducers";

const StakingTabs = () => {
  const [activeTab, setActiveTab] = useState("Stake")
    const { apr } = useSelector(
        (state: RootState) => state.initialData
    );

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
        <div className="p-4 bg-[#18181899] flex items-center mt-4 rounded-md">
            <div className="flex-1 border-r-[1px] border-solid border-[#2a2a2a]">
                <p className="text-light-mid font-normal leading-normal text-sm text-center">
                    APR
                </p>
                <p className="text-secondary font-semibold leading-normal text-2xl text-center">
                    {apr}%
                </p>
            </div>
            <div className="flex-1">
                <p className="text-light-mid font-normal leading-normal text-sm text-center">
                    Total Value Unlocked(TVU)
                </p>
                <p className="text-light-emphasis font-semibold leading-normal text-2xl text-center">
                    0 ATOM
                </p>
            </div>
        </div>
    </div>
  );
};


export default StakingTabs;
