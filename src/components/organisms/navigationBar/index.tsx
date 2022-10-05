import React from 'react';
import LoginOptions from "./loginOptions";
import Button from "../../atoms/button";
import {TEST_NET} from "../../../../AppConstants";
import { Icon } from "../../atoms/icon";
import { useDispatch } from "react-redux";
import { showMobileSidebar } from "../../../store/reducers/sidebar";
import Link from "next/link";
import { useWindowSize } from "../../../customHooks/useWindowSize";

const NavigationBar = () => {
  const dispatch = useDispatch();
  const {isMobile} = useWindowSize();

  const handleMenu = () => {
    dispatch(showMobileSidebar());
  }
  return (
    <div className="flex mb-10 py-6 px-7 md:px-3">
      <div className="flex items-center flex-1">
        <div className="hidden md:block">
          <Link href="/" className="nav-link" passHref>
             <img
                 src={"/images/logo.svg"}
                 alt={"logo"}
                 width={isMobile ? 90 : 124}
             />
          </Link>
        </div>
        <div className="flex ml-auto">
          <Button
            size="medium"
            type="custom"
            content={
              <div className="flex items-center">
                <div className="flex items-center">
                  <img
                    src={"/images/persistence_icon.svg"}
                    alt={"logo"}
                    width={18}
                    height={18}
                  />
                <span className="ml-3">
                    {
                      process.env.NEXT_PUBLIC_ENVIRONMENT === TEST_NET ?
                        "Persistence Testnet" : "Persistence Mainnet"
                    }
                </span>
              </div>
              </div>
            }
            className="button custom lg:hidden pointer-events-none"
          />
          <div className="pl-5">
            <LoginOptions/>
          </div>
          <button className="md:block hidden pl-2" onClick={handleMenu}>
            <Icon
              iconName="menu"
              viewClass="menu"
            />
          </button>
        </div>
      </div>
    </div>
  )
};

export default NavigationBar;