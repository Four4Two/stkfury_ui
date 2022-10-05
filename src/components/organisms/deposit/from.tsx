import React, { ChangeEvent } from "react";
import InputText from "../../atoms/input";
import { COIN_ATOM } from "../../../../AppConstants";
import { formatNumber } from "../../../helpers/utils";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/reducers";
import styles from "./styles.module.css"
import { useWallet } from "../../../context/WalletConnect/WalletConnect";
import { setDepositAmount } from "../../../store/reducers/transactions/deposit";
import { useWindowSize } from "../../../customHooks/useWindowSize";

const From = () => {
  const dispatch = useDispatch();
  const {ibcAtomBalance} = useSelector((state:RootState) => state.balances);
  const {amount} = useSelector((state:RootState) => state.deposit);
  const {atomPrice} = useSelector((state:RootState) => state.initialData)
  const priceInDollars = atomPrice * Number(amount)

  const {isWalletConnected} = useWallet();
  const { isMobile } = useWindowSize();

  const inputHandler = (evt:ChangeEvent<HTMLInputElement>) => {
    let rex = /^\d{0,10}(\.\d{0,6})?$/;
    if (rex.test(evt.target.value)) {
      dispatch(setDepositAmount(evt.target.value))
    } else {
      return false;
    }
  };

  const maxHandler = () => {
    dispatch(setDepositAmount(ibcAtomBalance.toString()))
  };


  return (
    <div className="flex-1">
      <div className="inputContainer border rounded-md p-6 bg-input border-solid border-[#1b1b1b99] flex-wrap flex md:p-3">
        <div className="flex justify-center flex-col flex-1">
          <div className="input-logo flex items-center">
            <img
              src={'/images/tokens/atom.svg'}
              width={isMobile ? 20 : 32} height={isMobile ? 20 : 32}
              className="logo" alt="atomIcon" />
            <span className="text-light-high text-3xl font-normal ml-2 md:text-lg">{COIN_ATOM}</span>
          </div>
          <p className="mt-3 leading-normal text-sm text-sm md:text-xsm">
            <span className="text-light-low">Available: </span>
            <span className="text-light-mid">{formatNumber(ibcAtomBalance, 3, 6)}</span>
            {isWalletConnected &&
                <span className="text-light-high ml-2 font-bold uppercase cursor-pointer"
                      onClick={maxHandler}>
                  Max
                </span>
            }
          </p>
        </div>
        <div>
          <InputText
            type="number"
            placeholder="0.00"
            value={amount.toString()}
            disable={false}
            required={true}
            name="depositInput"
            onChange={inputHandler}
            className={`${styles.Input} bg-transparent border-0
             text-light-high leading-normal 
             box-shadow-none font-normal 
             text-3xl m-0 focus:border-0 
             focus:box-shadow-none text-right md:text-lg
             p-0 mb-2 placeholder:text-light-mid placeholder:leading-normal placeholder:font-normal outline-none`}
          />
          <p className="text-light-low font-normal leading-normal text-right text-sm">${formatNumber(priceInDollars, 3, 2)}</p>
        </div>
      </div>
    </div>
  );
};


export default From;
