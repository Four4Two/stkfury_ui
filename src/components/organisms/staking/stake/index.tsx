import React from "react";
import From from "./from";
import To from "./To";
import { Icon } from "../../../atoms/icon";
import styles from "./styles.module.css";
import ExchangeRate from "../../../molecules/exchangeRate";
import Submit from "./submit";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store/reducers";
import StakeToasts from "./stakeToasts";

const UnStake = () => {
    const {showModal} = useSelector((state:RootState) => state.stake);
  return (
    <>
      <From />
      <div className="swap-icon flex w-full items-center justify-center relative">
        <div
          className={`${styles.iconBox} icon-box 
          rounded-full flex justify-center items-center absolute 
          w-[40px] h-[40px] bg-[#1A1A1A] md:w-[28px] md:h-[28px]`}
        >
          <Icon iconName="exchange-arrow" viewClass="search !w-[14px] md:!w-[10px]" />
        </div>
      </div>
      <To />
      <div className="flex items-center justify-between flex-wrap px-4 md:p-0">
        <p className="font-normal text-sm leading-7 text-light-emphasis mb-2">
          Exchange Rate
        </p>
        <p className="font-normal text-sm leading-7 text-light-emphasis text-right flex items-center mb-2">
          <ExchangeRate type={"stake"} />
        </p>
      </div>
      <div className="flex items-center justify-between flex-wrap px-4 md:p-0">
        <p className="font-normal text-sm leading-7 text-light-emphasis mb-2">
          Fee
        </p>
        <p className="font-normal text-sm leading-7 text-light-emphasis text-right mb-2">
          0%
        </p>
      </div>
      <div className="mt-4">
        <Submit />
      </div>
        {!showModal ?
            <StakeToasts/> : null
        }

    </>
  );
};

export default UnStake;
