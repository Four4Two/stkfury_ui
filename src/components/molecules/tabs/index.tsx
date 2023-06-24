import React, { useState } from "react";
import TabItem from "./tabItem";
import TabContent from "./tabContent";
import {ActiveStakeTab} from "../../../store/reducers/initialData/types";
import {setActiveStakeTab} from "../../../store/reducers/initialData";

const Tabs = () => {
  const [activeTab, setActiveTab] = useState("Stake");

    const tabHandler = (tab:ActiveStakeTab) =>{
        setActiveTab(tab)
    }

  return (
    <div>
      <ul
        className="flex flex-wrap -mb-px text-sm font-medium text-center"
        data-tabs-toggle="#myTabContent"
        role="tablist"
      >
        <TabItem
          id="Stake"
          title={"tab1"}
          activeTab={activeTab}
          onClick={tabHandler}
        />
        <TabItem
          id="Unstake"
          title={"tab2"}
          activeTab={activeTab}
          onClick={tabHandler}
        />
      </ul>
      <div>
        <TabContent id="tab1" activeTab={activeTab}>
          <p>Tab 1 works!</p>
        </TabContent>
        <TabContent id="tab2" activeTab={activeTab}>
          <p>Tab 2 works!</p>
        </TabContent>
      </div>
    </div>
  );
};

export default Tabs;
