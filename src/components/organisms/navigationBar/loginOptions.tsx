import React, { useEffect, useState, useRef } from "react";
import Styles from "./styles.module.css"
import Button from "../../atoms/button";
import { useWallet } from "../../../context/WalletConnect/WalletConnect";
import { Icon } from "../../atoms/icon";
import { stringTruncate } from "../../../helpers/utils";
import Copy from "../../molecules/copy";
import { useWindowSize } from "../../../customHooks/useWindowSize";
import {Window as KeplrWindow} from "@keplr-wallet/types/build/window";

declare global {
  interface Window extends KeplrWindow {
  }
}


export const LoginOptions = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const {connect, isWalletConnected, persistenceAccountData} = useWallet()
  const ref = useRef<HTMLDivElement>(null);
  const {isMobile} = useWindowSize();

  const connectHandler = async () =>{
   await connect();
   setDropdownOpen(false);
  }



  const disconnectHandler = async () =>{
    window.location.reload();
  }

  useEffect(() =>{
    window.addEventListener("keplr_keystorechange", async () => {
      await connect();
    })
  },[])

  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const node = ref.current;
      // Do nothing if clicking dropdown or its descendants
      if (!node || node.contains(event.target as Node)) return;
      setDropdownOpen(false);
    };
    document.addEventListener("mousedown", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
    };
  }, [ref, setDropdownOpen]);

  return (
    <div className="flex w-fit cursor-pointer relative">
      {isWalletConnected ?
        <Button
          size="medium"
          type="custom"
          content={
            <span className="flex items-center">
              <span className="flex items-center py-2.5 pr-1.5 pl-3"  onClick={()=>{setDropdownOpen(!dropdownOpen)}}>
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
        className="button md:text-xsm md:py-2 md:px-4"
        onClick={()=>{setDropdownOpen(!dropdownOpen)}}
        />
      }
      {dropdownOpen ?
          isWalletConnected ?
            <div className={`${Styles.DropdownMenu} absolute bg-dropDown rounded-md`} ref={ref}>
              <div className="p-4 flex items-center" onClick={disconnectHandler}>
                <Icon
                  iconName="disconnect"
                  viewClass="disconnect"
                />
                <span className="ml-4 text-light-mid text-sm font-medium leading-normal">Disconnect</span>
              </div>
            </div>
            :
            <div className={`${Styles.DropdownMenu} absolute bg-dropDown rounded-md`} ref={ref}>
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
        : ""
      }
    </div>
  )
}

export default LoginOptions