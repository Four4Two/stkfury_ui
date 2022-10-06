import React  from "react";
import From from "./from";
import Options from "./options";
import ExchangeRate from "../../../molecules/exchangeRate";
import Submit from "./submit";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store/reducers";
import { INSTANT } from "../../../../../AppConstants";
import Link from "next/link";

const Stake = () => {
  const {type} = useSelector((state:RootState) => state.unStake)
    const { redeemFee } = useSelector((state:RootState) => state.initialData);

  return (
      <>
        <From/>
        <Options/>
          <div className="flex items-center justify-between flex-wrap mt-4 px-4 md:p-0">
              <p className="font-normal text-sm leading-7 text-light-emphasis">
                  Exchange Rate
              </p>
              <p className="font-normal text-sm leading-7 text-light-emphasis text-right flex items-center">
                  <ExchangeRate type={'unstake'}/>
              </p>
          </div>
          {
              type === INSTANT ?
                  <div className="flex items-center justify-between flex-wrap mt-2 md:p-0 px-4">
                      <p className="font-normal text-sm leading-7 text-light-emphasis">
                          Fee
                      </p>
                      <p className="font-normal text-sm leading-7 text-light-emphasis text-right">
                          {Math.round(redeemFee * 100)}%
                      </p>
                  </div>
                  : ""
          }
        <div className="mt-4">
          <Submit/>
        </div>
        {
          type === INSTANT ?
            ""
            :
            <p className="text-light-emphasis font-normal leading-normal text-sm mt-4">
              Your stkATOM will only be unbonded after an unbonding period of up to 21 days. If you
              want
              immediate
              liquidity, you can swap stkATOM for ATOM on one of the DEXes listed in our &nbsp;
              <Link href="/" passHref>
                <a>DeFi section.</a>
              </Link>
            </p>
        }
      </>
  );
};


export default Stake;
