import React from "react";
import From from "./from";
import Options from "./options";
import ExchangeRate from "../../../molecules/exchangeRate";
import Submit from "./submit";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store/reducers";
import { INSTANT } from "../../../../../AppConstants";
import Link from "next/link";

const Stake = () => {
  const { type } = useSelector((state: RootState) => state.unStake);

  return (
    <>
      <From />
      <Options />
      <div className="flex items-center justify-between flex-wrap mt-4 px-4 md:p-0">
        <p className="font-normal text-sm leading-7 text-light-emphasis">
          Exchange Rate
        </p>
        <p className="font-normal text-sm leading-7 text-light-emphasis text-right flex items-center">
          <ExchangeRate type={"unstake"} />
        </p>
      </div>
      <div className="mt-4">
        <Submit />
      </div>
      {type === INSTANT ? (
        <p className="text-light-emphasis font-normal leading-normal text-sm mt-4">
          Redeem stkATOM and receive ATOM to your Cosmos wallet instantly.
        </p>
      ) : (
        <p className="text-light-emphasis font-normal leading-normal text-sm mt-4">
          Your stkATOM will only be unbonded after an unbonding period of 21-25
          days. If you want immediate liquidity, you can swap stkATOM for ATOM
          on one of the DEXes listed in our&nbsp;
          <Link href="/defi" passHref>
            <a className="text-[#3e73f0]">DeFi section.</a>
          </Link>
        </p>
      )}
    </>
  );
};

export default Stake;
