import React  from "react";
import { TabItemTypes } from "./types";

const TabItem = ({
                   title,
                   activeTab,
                   id,
                   setActiveTab,
  className
}:TabItemTypes) => {

  const handleClick = () => {
    setActiveTab(id);
  };

  return (
      <li onClick={handleClick} className={`${activeTab === id ? "active tabItem" : "tabItem"} ` +className} >
        {title}
      </li>
  );
};


export default TabItem;