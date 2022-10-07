import React, {useState } from "react";
import logo from "../../assets/images/logo.svg";
import Link from "next/link";
import { Icon } from "../../atoms/icon";
import {useDispatch, useSelector} from "react-redux";
import { RootState } from "../../../store/reducers";
import Styles from "./styles.module.css"
import { useRouter } from "next/router";
import {emptyFunc, formatNumber} from "../../../helpers/utils";
import { useWallet } from "../../../context/WalletConnect/WalletConnect";
import Button from "../../atoms/button";
import { showDepositModal } from "../../../store/reducers/transactions/deposit";
import { hideMobileSidebar } from "../../../store/reducers/sidebar";
import {useWindowSize} from "../../../customHooks/useWindowSize";
import Tooltip from "rc-tooltip";
import 'rc-tooltip/assets/bootstrap.css';

const socialList = [
  {
    url: 'https://twitter.com/pStakeFinance',
    iconName: 'twitter-logo',
    tooltip: 'twitter'
  },
  {
    url: 'https://twitter.com/pstake_cosmos?s=11&t=E_q2T3rK9Bwiywy_YCvo5A',
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
  const {isWalletConnected} = useWallet()
  const {isMobile} = useWindowSize();

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

  const closeSideHandler = () => {
    dispatch(hideMobileSidebar())
  }

  const router = useRouter();
  return (
    <aside className="w-[284px] md:w-[220px]">
      <div className={`${Styles.sideBarContent} bg-side-bar flex flex-col justify-between overflow-y-auto sticky`}>
        <div>
          <div className="text-center py-8">
            <Link href="/" className="nav-link" passHref>
             <div className='text-center'>
               <img
                   src={"/images/logo.svg"}
                   alt={"logo"}
                   className='m-auto'
                   width={isMobile ? 90 : 124}
               />
             </div>
            </Link>
          </div>
          <div>
            <li className={`list-none`}>
              <Link href="/" passHref>
                <p className={`${Styles.navBarLink } ${router.pathname == "/" ? `${Styles.active} navItemActive` : ""} 
                py-3 px-8 flex items-center active:bg-sideBar-navLinkActive cursor-pointer`}
                onClick={isMobile ? closeSideHandler : emptyFunc}>
                  <Icon
                    iconName="staking"
                    viewClass="side-bar-icon mr-8 md:mr-4"
                  />
                  <span className="text text-light-mid leading-6 text-base md:text-sm">Staking</span>
                </p>
              </Link>
            </li>
            <li className={`list-none`}>
              <Link href={"/defi"} passHref>
                <p className={`${Styles.navBarLink } ${router.pathname == "/defi" ? `${Styles.active} navItemActive` : ""} 
                py-3 px-8 flex items-center cursor-pointer`}
                   onClick={isMobile ? closeSideHandler : emptyFunc}>
                  <Icon
                    iconName="defi"
                    viewClass="side-bar-icon mr-8 md:mr-4"
                  />
                  <span className="text text-light-mid leading-6 text-base md:text-sm">DeFi</span>
                </p>
              </Link>
            </li>
            <li className={`list-none`}>
              <Link href="/" className="nav-link" passHref>
                <p className={`${Styles.navBarLink } ${router.pathname == "/transaction" ? `${Styles.active} navItemActive` : ""}
                 py-3 px-8 flex items-center cursor-pointer`}
                   onClick={isMobile ? closeSideHandler : emptyFunc}>
                  <Icon
                    iconName="transactions"
                    viewClass="side-bar-icon mr-8 md:mr-4"
                  />
                  <span className="text text-light-mid leading-6 text-base md:text-sm">Transactions</span>
                </p>
              </Link>
            </li>
            <li className={`list-none`}>
              <p onClick={() => setOpen(!open)}
                 aria-controls="more-list"
                 aria-expanded={open}
                 className={`flex items-center justify-between navLink moreListHeader cursor-pointer m-0 ${open ? "opened" : "closed"} py-3 px-8`}>
                  <span className="flex items-center">
                      <Icon
                        iconName="more"
                        viewClass="side-bar-icon mr-8 md:mr-4"
                      />
                      <span className="text-light-mid leading-6 text-base md:text-sm">More</span>
                  </span>
                <Icon
                  iconName="right-arrow"
                  viewClass="side-bar-icon arrow"
                />
              </p>
              <div id="more-list" className={`${open ? '': 'active'} moreList h-[180px] 
              overflow-hidden relative bg-[#1B1B1B]`}>
                  {
                    moreList.map((item, index) => (
                      <a className="pr-8 py-2 pl-12 flex items-center text-light-mid"
                         href={item.url}
                         target={"_blank"}
                         key={index}
                         rel="noopener noreferrer"
                         onClick={isMobile ? closeSideHandler : emptyFunc}>
                        <span>
                          <Icon
                              iconName={item.icon}
                              viewClass="itemIcon"
                          />
                        </span>
                        <span className="ml-2 text-base md:text-sm">{item.name}</span>
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
               <Tooltip placement="bottom" overlay={<span>Only showing balances of <br/> your assets staked via pSTAKE.</span>}>
                 <button className="icon-button px-1">
                   <Icon
                       viewClass="arrow-right"
                       iconName="info"/>
                 </button>
               </Tooltip>
            </h2>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <img src={'/images/tokens/atom.svg'} width={24} height={24} alt="atom"/>
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
                      <Tooltip placement="bottom" overlay={item.tooltip} key={index}>
                        <a href={item.url}
                           rel="noopener noreferrer"
                           className="mr-2.5"
                           target="_blank">
                          <Icon viewClass="socialIcon"
                                iconName={item.iconName}/>
                        </a>
                      </Tooltip>
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