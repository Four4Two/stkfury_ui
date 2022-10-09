import React, {useEffect, useState} from "react";
import Styles from "./styles.module.css"
import Button from "../../atoms/button";
import { useWallet } from "../../../context/WalletConnect/WalletConnect";
import { Icon } from "../../atoms/icon";
import {stringTruncate } from "../../../helpers/utils";
import Copy from "../../molecules/copy";
import { useWindowSize } from "../../../customHooks/useWindowSize";
import {Window as KeplrWindow} from "@keplr-wallet/types/build/window";
import {useOnClickOutside} from "../../../customHooks/useOnClickOutside";

declare global {
  interface Window extends KeplrWindow {
  }
}


export const LoginOptions = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const {connect, isWalletConnected, persistenceAccountData} = useWallet()
  const {isMobile} = useWindowSize();

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

  const ref = useOnClickOutside(()=>{setDropdownOpen(false)})

  return (
    <div className="inline-block w-fit cursor-pointer relative">
      {isWalletConnected ?
        <Button
          size="medium"
          type="custom"
          content={
            <span className="flex items-center">
              <span className={`${dropdownOpen ? 'pointer-events-none' : 'pointer-events-auto'} flex items-center py-2.5 pr-1.5 pl-3`}
                    onClick={()=>{setDropdownOpen(true)}}>
                <img
                  src={"/images/keplr.svg"}
                  alt={"logo"}
                  width={isMobile ? 14 : 18}
                  height={isMobile ? 14 : 18}
                />
                <span className="ml-3">{stringTruncate(persistenceAccountData!.address)}</span>
              </span>
              <span className="py-2.5 pr-3 pl-1.5">
                <Copy id={persistenceAccountData!.address}/>
              </span>
            </span>

          }
          className="button custom connected md:text-xsm"
        />
        :
          <Button
            size="medium"
            type="primary"
            content="Connect Wallet"
            className={`${dropdownOpen ? 'pointer-events-none' : 'pointer-events-auto'} button md:text-xsm md:py-2 md:px-4`}
            onClick={()=>{setDropdownOpen(true)}}
          />
      }
      <div className={`${Styles.DropdownMenu} ${dropdownOpen && Styles.DropdownMenuActive} absolute bg-dropDown rounded-md`}
           ref={ref}>
        {isWalletConnected ?
            <>
              <div className="p-4 flex items-center" onClick={disconnectHandler}>
                <Icon
                    iconName="disconnect"
                    viewClass="disconnect"
                />
                <span className="ml-4 text-light-mid text-sm font-medium leading-normal">Disconnect</span>
              </div>
            </>
            :
            <div>
              <div className="p-4 flex items-center" onClick={connectHandler}>
                <img
                    src={"/images/keplr.svg"}
                    alt={"logo"}
                    width={20}
                    height={20}
                />
                <span className="ml-4 text-light-mid text-sm font-medium leading-normal">Keplr Wallet</span>
              </div>
            </div>
        }
      </div>
    </div>
  )
}

export default LoginOptions