import React, { useEffect, useState } from "react";
import logo from "../../assets/images/logo.svg";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "../../atoms/icon";
import {useDispatch, useSelector} from "react-redux";
import { RootState } from "../../../store/reducers";
import { Tooltip } from "flowbite-react";
import Styles from "./styles.module.css"
import { useRouter } from "next/router";
import { formatNumber } from "../../../helpers/utils";
import { useWallet } from "../../../context/WalletConnect/WalletConnect";
import Button from "../../atoms/button";
import { fetchInitSaga } from "../../../store/reducers/initialData";
import Deposit from "../deposit";
import { showDepositModal } from "../../../store/reducers/transactions/deposit";
import { hideMobileSidebar } from "../../../store/reducers/sidebar";

const socialList = [
  {
    url: 'https://twitter.com/pStakeFinance',
    iconName: 'twitter-logo',
    tooltip: 'twitter'
  },
  {
    url: 'https://t.me/pstakefinance',
    iconName: 'telegram-plane',
    tooltip: 'telegram'
  },
  {
    url: 'https://blog.pstake.finance/',
    iconName: 'medium-m',
    tooltip: 'medium'
  }
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const {atomBalance} = useSelector((state:RootState) => state.balances);
  const {isWalletConnected, persistenceChainData} = useWallet()

  const moreList = [
    {
      url: 'https://pstake.finance/',
      name: 'pstake.finance',
      icon: 'globe'
    },
    {
      url: 'https://docs.pstake.finance/',
      name: 'Docs',
      icon: 'docs'
    },
    {
      url: 'https://analytics.pstake.finance/',
      name: 'Analytics',
      icon: 'analytics'
    },
    {
      url: 'https://forum.pstake.finance/',
      name: 'Governance',
      icon: 'governance'
    }
  ];

  const depositHandler = async () => {
    dispatch(hideMobileSidebar())
    dispatch(showDepositModal())
  }

  const router = useRouter();
  return (
    <aside className={`w-61`} >
      <div className={`${Styles.sideBarContent} bg-side-bar flex flex-col justify-between overflow-y-auto sticky`}>
        <div>
          <div className="text-center py-8">
            <Link href="/" className="nav-link" passHref>
              <Image
                src={"/images/logo.svg"}
                alt={"logo"}
                width={90}
                height={32}
              />
            </Link>
          </div>
          <div>
            <li className={`${Styles.navBarItem} list-none`}>
              <Link href="/" passHref>
                <p className={`${Styles.navBarLink } ${router.pathname == "/" ? `${Styles.active} navItemActive` : ""} py-3 px-8 flex items-center active:bg-sideBar-navLinkActive`}>
                  <Icon
                    iconName="staking"
                    viewClass="side-bar-icon mr-8"
                  />
                  <span className="text text-light-mid leading-6 text-base">Staking</span>
                </p>
              </Link>
            </li>
            <li className={`${Styles.navBarItem} list-none`}>
              <Link href={"/"} passHref>
                <p className={`${Styles.navBarLink } ${router.pathname == "/transaction" ? `${Styles.active} navItemActive` : ""} py-3 px-8 flex items-center`}>
                  <Icon
                    iconName="defi"
                    viewClass="side-bar-icon mr-8"
                  />
                  <span className="text text-light-mid leading-6 text-base">DeFi</span>
                </p>
              </Link>
            </li>
            <li className={`${Styles.navBarItem} list-none`}>
              <Link href="/" className="nav-link" passHref>
                <p className={`${Styles.navBarLink } ${router.pathname == "/transaction" ? `${Styles.active} navItemActive` : ""} py-3 px-8 flex items-center`}>
                  <Icon
                    iconName="transactions"
                    viewClass="side-bar-icon mr-8"
                  />
                  <span className="text text-light-mid leading-6 text-base">Transactions</span>
                </p>
              </Link>
            </li>
            <li className={`${Styles.navBarItem} list-none`}>
              <p onClick={() => setOpen(!open)}
                 aria-controls="more-list"
                 aria-expanded={open}
                 className={`flex items-center justify-between navLink moreListHeader cursor-pointer m-0 ${open ? "opened" : "closed"} py-3 px-8`}>
                  <span className="flex items-center">
                      <Icon
                        iconName="more"
                        viewClass="side-bar-icon mr-8"
                      />
                      <span className="text-light-mid leading-6 text-base">More</span>
                  </span>
                <Icon
                  iconName="right-arrow"
                  viewClass="side-bar-icon arrow"
                />
              </p>
              <div id="more-list" className={`${open ? '': 'active'} moreList`}>
                  {
                    moreList.map((item, index) => (
                      <a className="pr-8 py-2 pl-12 flex items-center text-light-mid "
                         href={item.url}
                         target={"_blank"}
                         key={index}
                         rel="noopener noreferrer">
                        <Icon
                          iconName={item.icon}
                          viewClass="itemIcon mr-2"
                        />
                        {item.name}
                        <Icon
                          iconName="arrow-redirect-white"
                          viewClass="redirect"
                        />
                      </a>
                    ))
                  }
                </div>
            </li>
          </div>
        </div>
        <div>
          <div className={`${Styles.balanceList} p-6`}>
            <h2 className="text-light-emphasis text-base flex items-center font-semibold leading-normal mb-4">Balances
             <div className={`${Styles.toolTipHeader} md:hidden`}>
               <Tooltip
                 placement="bottom"
                 content={<p className="m-0">
                   Only showing balances of your assets staked via pSTAKE.
                 </p>}>
                 <button className="icon-button px-1" type="button">
                   <Icon
                     viewClass="arrow-right"
                     iconName="info"/>
                 </button>
               </Tooltip>
             </div>
            </h2>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Image src="/images/tokens/atom.svg" width={24} height={24} alt="atom"/>
                <span className="text-light-mid text-sm leading-5 ml-2.5">ATOM</span>
              </div>
              <p className="text-light-mid text-sm font-medium leading-5">{formatNumber(atomBalance, 3, 6)}</p>
            </div>
          </div>

          {isWalletConnected ?
            <div className={`${Styles.DepositButton} m-auto`}>
              <Button
                size="medium"
                type="secondary"
                content="Deposit"
                className="w-full mb-4  md:text-xsm md:py-2 md:px-4"
                onClick={depositHandler}/>
            </div>
            : ""
          }

          <div className={`${Styles.socialLinks} socialLinks flex py-3 px-6`}>
              {
                socialList.map((item, index) => (
                  <div className={Styles.toolTipHeader} key={index}>
                    <Tooltip
                    placement="top"
                    content={item.tooltip}>
                      <a href={item.url}
                         rel="noopener noreferrer"
                         className="mr-2.5"
                         target="_blank">
                        <Icon viewClass="socialIcon"
                              iconName={item.iconName}/>
                      </a>
                    </Tooltip>
                  </div>
                ))
              }
          </div>
          <div className="text-light-low text-xsm font-medium leading-4 pb-3 px-6">
            <a href="https://persistence.one/" target="_blank" rel="noreferrer">By Persistence</a>
          </div>
        </div>
      </div>
    </aside>
  )
};

export default Sidebar;