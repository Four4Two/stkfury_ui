import React from "react";
import From from "./from";
import To from "./To";
import { Icon } from "../../../atoms/icon";
import styles from "./styles.module.css";
import ExchangeRate from "../../../molecules/exchangeRate";
import Submit from "./submit";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store/reducers";

const UnStake = () => {
  const { apr, atomPrice } = useSelector(
    (state: RootState) => state.initialData
  );
  return (
    <>
      <From />
      <div className="swap-icon flex w-full items-center justify-center relative">
        <div
          className={`${styles.iconBox} icon-box rounded-full flex justify-center items-center absolute`}
        >
          <Icon iconName="exchange-arrow" viewClass="search" />
        </div>
      </div>
      <To />
      <div className="flex items-center justify-between flex-wrap">
        <p className="font-normal text-sm leading-7 text-light-emphasis mb-2">
          Exchange Rate
        </p>
        <p className="font-normal text-sm leading-7 text-light-emphasis text-right flex items-center mb-2">
          <ExchangeRate type={"stake"} />
        </p>
      </div>
      <div className="flex items-center justify-between flex-wrap">
        <p className="font-normal text-sm leading-7 text-light-emphasis mb-2">
          Staking APR
        </p>
        <p className="font-normal text-sm leading-7 text-light-emphasis text-right mb-2">
          {apr}%
        </p>
      </div>
      <div className="mt-4">
        <Submit />
      </div>
    </>
  );
};

export default UnStake;
