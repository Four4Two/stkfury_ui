import React, { Dispatch, SetStateAction } from "react";
import {ActiveStakeTab} from "../../../store/reducers/initialData/types";

export interface TabItemTypes {
  id: ActiveStakeTab;
  title: React.ReactNode | string;
  activeTab: string;
  onClick: (tab:ActiveStakeTab)=>void;
  className?: string;
}

export interface TabContentTypes {
  id: string;
  children: React.ReactNode | string;
  activeTab: string;
  className?: string;
}
