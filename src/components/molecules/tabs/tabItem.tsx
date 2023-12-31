import React from "react";
import { TabItemTypes } from "./types";

const TabItem = ({
  title,
  activeTab,
  id,
  onClick,
  className
}: TabItemTypes) => {
  return (
    <li
      onClick={()=>onClick(id)}
      className={
        `${
          activeTab === id ? "active tabItem" : "tabItem hover:text-light-high"
        } ` + className
      }
    >
      {title}
    </li>
  );
};

export default TabItem;
