import React  from "react";
import From from "./from";
import { Icon } from "../../../atoms/icon";
import styles from './styles.module.css'
import Options from "./options";
import ExchangeRate from "../../../molecules/exchangeRate";
import Submit from "./submit";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store/reducers";
import { INSTANT } from "../../../../../AppConstants";
import Link from "next/link";

const Stake = () => {
  const {type} = useSelector((state:RootState) => state.unStake)

  return (
      <>
        <From/>
        <div className="flex items-center justify-between flex-wrap mb-4 px-4">
          <p className="font-normal text-sm leading-7 text-light-emphasis">
            Exchange Rate
          </p>
          <p className="font-normal text-sm leading-7 text-light-emphasis text-right flex items-center">
            <ExchangeRate type={'stake'}/>
          </p>
        </div>
        <Options/>
        <div className="mt-5">
          <Submit/>
        </div>
        {
          type === INSTANT ?
            ""
            :
            <p className="text-light-emphasis font-normal leading-normal text-sm mt-4">
              Your stkATOM will only be unbonded after an unbonding period of up to 24 days. If you
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
