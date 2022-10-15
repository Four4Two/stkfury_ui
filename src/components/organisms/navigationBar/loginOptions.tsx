import React, {useEffect, useRef, useState} from "react";
import Styles from "./styles.module.css"
import Button from "../../atoms/button";
import { useWallet } from "../../../context/WalletConnect/WalletConnect";
import { Icon } from "../../atoms/icon";
import {stringTruncate } from "../../../helpers/utils";
import Copy from "../../molecules/copy";
import {Window as KeplrWindow} from "@keplr-wallet/types/build/window";
import {useOnClickOutside} from "../../../customHooks/useOnClickOutside";
import {useWindowSize} from "../../../customHooks/useWindowSize";

declare global {
  interface Window extends KeplrWindow {
  }
}

export const LoginOptions = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const {connect, isWalletConnected, persistenceAccountData} = useWallet()
    const { isMobile } = useWindowSize();

  const connectHandler = async () =>{
   await connect();
   setDropdownOpen(false);
  }

  const disconnectHandler = async () =>{
    localStorage.clear();
    window.location.reload();
  }

  useEffect(() =>{
    {
      isWalletConnected ?
          window.addEventListener("keplr_keystorechange", async () => {
            await connect();
          }) : null
    }
  },[isWalletConnected, connect])

    const ref = useRef<HTMLDivElement>(null)
    useOnClickOutside(ref, ()=>{setDropdownOpen(false)})

  return (
    <div className="inline-block w-fit cursor-pointer relative">
      {isWalletConnected ?
        <Button
          size="medium"
          type="custom"
          content={
            <span className="flex items-center">
              <span className={`${dropdownOpen ? 'pointer-events-none' : 'pointer-events-auto'} 
              flex items-center py-2 pr-1.5 pl-3 !text-sm`}
                    onClick={()=>{setDropdownOpen(true)}}>
                <img
                  src={"/images/keplr_round.svg"}
                  alt={"logo"}
                  className="w-[20px] h-[20px]"
                />
                <span className="ml-3">{stringTruncate(persistenceAccountData!.address, isMobile ? 3 : 7)}</span>
              </span>
              <span className="py-2 pr-3 pl-1.5">
                <Copy id={persistenceAccountData!.address}/>
              </span>
            </span>

          }
          className="button custom connected md:text-xsm !text-sm"
        />
        :
          <Button
            size="medium"
            type="primary"
            content="Connect Wallet"
            className={`${dropdownOpen ? 'pointer-events-none' : 'pointer-events-auto'}
             button md:text-xsm md:py-2 md:px-4 !text-sm`}
            onClick={()=>{setDropdownOpen(true)}}
          />
      }
      <div className={`${Styles.DropdownMenu} 
      ${dropdownOpen && Styles.DropdownMenuActive} 
      absolute bg-dropDown rounded-md`}
           ref={ref}>
        {isWalletConnected ?
            <>
              <div className="p-4 flex items-center md:py-3" onClick={disconnectHandler}>
                <Icon
                    iconName="disconnect"
                    viewClass="disconnect md:!w-[16px] md:!h-[16px]"
                />
                <span className="ml-4 text-light-high text-sm font-bold leading-normal uppercase md:text-xsm md:ml-2">
                    Disconnect
                </span>
              </div>
            </>
            :
            <div>
              <div className="p-4 flex items-center md:py-3" onClick={connectHandler}>
                <img
                    src={"/images/keplr_round.svg"}
                    alt={"logo"}
                    className="w-[20px] h-[20px]"
                />
                <span className="ml-4 text-light-high text-sm font-medium leading-normal md:text-xsm md:ml-2">Keplr Wallet</span>
              </div>
            </div>
        }
      </div>
    </div>
  )
}

export default LoginOptions