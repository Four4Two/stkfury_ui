import React, { useState } from "react";
import logo from "../../assets/images/logo.svg";
import Link from "next/link";
import { Icon } from "../../atoms/icon";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/reducers";
import Styles from "./styles.module.css";
import { useRouter } from "next/router";
import { emptyFunc } from "../../../helpers/utils";
import { useWindowSize } from "../../../customHooks/useWindowSize";
import Tooltip from "rc-tooltip";
import "rc-tooltip/assets/bootstrap.css";
import WithdrawToasts from "./withdrawModal/withdrawToasts";
import BalanceList from "./balanceList";
import { hideMobileSidebar } from "../../../store/reducers/sidebar";
import { useWallet } from "../../../context/WalletConnect/WalletConnect";

const socialList = [
  {
    url: "https://twitter.com/pSTAKE_Cosmos",
    iconName: "twitter-logo",
    tooltip: "Twitter"
  },
  {
    url: " https://t.me/pstakefinancechat",
    iconName: "telegram-plane",
    tooltip: "Telegram"
  },
  {
    url: "https://blog.pstake.finance/category/stkatom/",
    iconName: "medium-m",
    tooltip: "Medium"
  }
];

const moreList = [
  {
    url: "https://pstake.finance/atom",
    name: "Website",
    icon: "website"
  },
  {
    url: "https://docs.pstake.finance/stkATOM_Introduction/",
    name: "Docs",
    icon: "docs"
  },
  {
    url: "https://forum.pstake.finance/",
    name: "Governance",
    icon: "governance"
  }
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { showModal } = useSelector((state: RootState) => state.withdraw);
  const { persistenceAccountData, isWalletConnected } = useWallet();

  const { isMobile } = useWindowSize();

  const closeSideHandler = () => {
    dispatch(hideMobileSidebar());
  };

  const router = useRouter();
  return (
    <aside className="w-[284px] md:w-[220px]">
      <div
        className={`${Styles.sideBarContent} flex flex-col justify-between overflow-y-auto sticky`}
      >
        <div>
          <div className="text-center py-[2.1875rem]">
            <Link href="/" className="nav-link" passHref>
              <a className="text-center">
                <img
                  src={"/images/logo.svg"}
                  alt={"logo"}
                  className="m-auto"
                  width={isMobile ? 90 : 124}
                />
              </a>
            </Link>
          </div>
          <div>
            <li className={`list-none`}>
              <Link href="/" passHref>
                <p
                  className={`${Styles.navBarLink} ${
                    router.pathname == "/"
                      ? `${Styles.active} navItemActive`
                      : "group"
                  } 
                py-3 px-8 flex items-center active:bg-sideBar-navLinkActive cursor-pointer`}
                  onClick={isMobile ? closeSideHandler : emptyFunc}
                >
                  <span className={"mr-8 md:mr-4 "}>
                    <Icon
                      iconName="staking"
                      viewClass={`${Styles.navBarLinkIcon} side-bar-icon group-hover:fill-[#fcfcfc]`}
                    />
                  </span>
                  <span className="text text-light-mid leading-6 text-base md:text-sm group-hover:text-light-high">
                    Staking
                  </span>
                </p>
              </Link>
            </li>
            <li className={`list-none`}>
              <Link href={"/defi"} passHref>
                <p
                  className={`${Styles.navBarLink} ${
                    router.pathname == "/defi"
                      ? `${Styles.active} navItemActive`
                      : "group"
                  } 
                py-3 px-8 flex items-center cursor-pointer`}
                  onClick={isMobile ? closeSideHandler : emptyFunc}
                >
                  <span className={"mr-8 md:mr-4 "}>
                    <Icon
                      iconName="defi"
                      viewClass={`${Styles.navBarLinkIcon} side-bar-icon group-hover:fill-[#fcfcfc]`}
                    />
                  </span>
                  <span className="text text-light-mid leading-6 text-base md:text-sm group-hover:text-light-high">
                    DeFi
                  </span>
                </p>
              </Link>
            </li>
            {isWalletConnected ? (
              <li className={`list-none`}>
                <Link
                  href={`https://www.mintscan.io/persistence/account/${persistenceAccountData?.address}`}
                  className="nav-link"
                  passHref
                >
                  <a
                    target={"_blank"}
                    rel="noopener noreferrer"
                    className={`${Styles.navBarLink} group py-3 sm:pt-3 sm:pb-6 -xl:pt-3 -xl:pb-6 px-8 flex items-center cursor-pointer`}
                    onClick={isMobile ? closeSideHandler : emptyFunc}
                  >
                    <span className={"mr-8 md:mr-4 "}>
                      <Icon
                        iconName="transactions"
                        viewClass={`!w-[18px] !h-[18px] side-bar-icon  group-hover:fill-[#fcfcfc]`}
                      />
                    </span>
                    <span className="text text-light-mid leading-6 text-base md:text-sm group-hover:text-light-high">
                      Transactions
                    </span>
                    <span>
                      <Icon
                        iconName="new-tab"
                        viewClass={`!w-[8px] !h-[8px] side-bar-icon -mb-0.5 mr-8 ml-1.5 group-hover:fill-[#fcfcfc]`}
                      />
                    </span>
                  </a>
                </Link>
              </li>
            ) : null}
            <li className={`list-none`}>
              <p
                onClick={() => setOpen(!open)}
                className={`flex items-center justify-between navLink moreListHeader cursor-pointer m-0 
                 ${
                   open ? "opened" : "closed"
                 } py-3 px-8 group sm:hidden -xl:hidden  `}
              >
                <span className="flex items-center">
                  <Icon
                    iconName="more"
                    viewClass={`${Styles.navBarLinkIcon} side-bar-icon mr-8 md:mr-4 group-hover:fill-[#fcfcfc]`}
                  />
                  <span className="text-light-mid leading-6 text-base md:text-sm group-hover:text-light-high">
                    More
                  </span>
                </span>
                <Icon iconName="right-arrow" viewClass="side-bar-icon arrow" />
              </p>
              <div
                id="more-list"
                className={`${
                  open ? "h-[140px]" : "active h-0"
                } moreList -xl:h-[140px] sm:h-[140px]  
              overflow-hidden relative bg-[#1B1B1B] -xl:pt-2 -xl:bg-transparent sm:pt-2 sm:bg-transparent
               -xl:border-t -xl:border-solid -xl:border-[#2b2b2b] sm:border-t sm:border-solid sm:border-[#2b2b2b] transition-height duration-200 ease-in-out`}
              >
                {moreList.map((item, index) => (
                  <a
                    className="pr-8 py-2 pl-12 sm:py-3 sm:px-8 -xl:py-3 -xl:px-8 flex items-center text-light-mid"
                    href={item.url}
                    target={"_blank"}
                    key={index}
                    rel="noopener noreferrer"
                    onClick={isMobile ? closeSideHandler : emptyFunc}
                  >
                    <span className="sm:mr-4 -xl:mr-8">
                      <Icon
                        iconName={item.icon}
                        viewClass="itemIcon md:!w-[14px] md:!h-[14px] "
                      />
                    </span>
                    <span className="ml-2 sm:ml-0 -xl:ml-0 text-base md:text-sm">
                      {item.name}
                    </span>
                    <span>
                      <Icon
                        iconName="new-tab"
                        viewClass={`!w-[8px] !h-[8px] side-bar-icon 
                        -mb-0.5 mr-8 ml-1.5 group-hover:fill-[#fcfcfc]`}
                      />
                    </span>
                  </a>
                ))}
              </div>
            </li>
          </div>
        </div>
        <div>
          <BalanceList />
          <div className={`socialLinks flex pb-3 px-6`}>
            {socialList.map((item, index) => (
              <Tooltip placement="bottom" overlay={item.tooltip} key={index}>
                <a
                  href={item.url}
                  rel="noopener noreferrer"
                  className="mr-2.5"
                  target="_blank"
                >
                  <Icon viewClass="socialIcon" iconName={item.iconName} />
                </a>
              </Tooltip>
            ))}
          </div>
          <div className="text-light-low text-xsm font-medium leading-4 pb-3 px-6">
            <a href="https://persistence.one/" target="_blank" rel="noreferrer">
              By Persistence
            </a>
          </div>
        </div>
      </div>
      {!showModal ? <WithdrawToasts /> : null}
    </aside>
  );
};

export default Sidebar;
