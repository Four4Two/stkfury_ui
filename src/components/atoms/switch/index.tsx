import React from "react";
import { SwitchTypes } from "./types";
import styles from "./styles.module.css";
import { emptyFunc } from "../../../helpers/utils";

export const Switch = ({
  size = "md",
  labelText,
  checked = false,
  onChange = emptyFunc
}: SwitchTypes) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <div className="relative">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={onChange}
      />
      <div
        className={`${styles[size]} ${size} switch bg-transparent border-[1.5px] !border-[#fcfcfc] peer-focus:outline-none rounded-full
       peer peer-checked:after:translate-x-full peer-checked:after:border-[1.5px] peer-checked:after:border-[#fcfcfc] peer-checked:after:-left-[1px]  after:content-[''] after:absolute
        after:top-[1px] after:left-[0px] after:bg-white after:border-[#fcfcfc] after:border-[1.5px] after:rounded-full
         after:transition-all peer-checked:bg-[#FCFCFC] peer-checked:after:bg-[#282828]`}
      ></div>
    </div>
    <span className="ml-2 text-sm text-light-high"> {labelText}</span>
  </label>
);
