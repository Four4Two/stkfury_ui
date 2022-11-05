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
    url: "https://pstake.finance/",
    name: "pstake.finance",
    icon: "globe"
  },
  {
    url: "https://docs.pstake.finance/",
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
                  <Icon
                    iconName="staking"
                    viewClass={`${Styles.navBarLinkIcon} side-bar-icon mr-8 md:mr-4 group-hover:fill-[#fcfcfc]`}
                  />
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
                  <Icon
                    iconName="defi"
                    viewClass={`${Styles.navBarLinkIcon} side-bar-icon mr-8 md:mr-4 group-hover:fill-[#fcfcfc]`}
                  />
                  <span className="text text-light-mid leading-6 text-base md:text-sm group-hover:text-light-high">
                    DeFi
                  </span>
                </p>
              </Link>
            </li>
            <li className={`list-none`}>
              <Link href="/transactions" className="nav-link" passHref>
                <p
                  className={`${Styles.navBarLink} ${
                    router.pathname == "/transactions"
                      ? `${Styles.active} navItemActive`
                      : "group"
                  }
                 py-3 px-8 flex items-center cursor-pointer`}
                  onClick={isMobile ? closeSideHandler : emptyFunc}
                >
                  <Icon
                    iconName="transactions"
                    viewClass={`${Styles.navBarLinkIcon} side-bar-icon mr-8 md:mr-4 group-hover:fill-[#fcfcfc]`}
                  />
                  <span className="text text-light-mid leading-6 text-base md:text-sm group-hover:text-light-high">
                    Transactions
                  </span>
                </p>
              </Link>
            </li>
            <li className={`list-none`}>
              <p
                onClick={() => setOpen(!open)}
                aria-controls="more-list"
                aria-expanded={open}
                className={`flex items-center justify-between navLink moreListHeader cursor-pointer m-0 
                 ${open ? "opened" : "closed"} py-3 px-8 group`}
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
                className={`${open ? "" : "active"} moreList h-[180px] 
              overflow-hidden relative bg-[#1B1B1B]`}
              >
                {moreList.map((item, index) => (
                  <a
                    className="pr-8 py-2 pl-12 flex items-center text-light-mid"
                    href={item.url}
                    target={"_blank"}
                    key={index}
                    rel="noopener noreferrer"
                    onClick={isMobile ? closeSideHandler : emptyFunc}
                  >
                    <span>
                      <Icon iconName={item.icon} viewClass="itemIcon" />
                    </span>
                    <span className="ml-2 text-base md:text-sm">
                      {item.name}
                    </span>
                    <Icon
                      iconName="arrow-redirect-white"
                      viewClass="redirect"
                    />
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
