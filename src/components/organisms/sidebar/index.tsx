import React, {useEffect, useState} from "react";
import logo from "../../assets/images/logo.svg";
import Link from "next/link";
import { Icon } from "../../atoms/icon";
import {useDispatch, useSelector} from "react-redux";
import { RootState } from "../../../store/reducers";
import Styles from "./styles.module.css"
import { useRouter } from "next/router";
import {decimalize, emptyFunc, formatNumber, truncateToFixedDecimalPlaces} from "../../../helpers/utils";
import { useWallet } from "../../../context/WalletConnect/WalletConnect";
import Button from "../../atoms/button";
import { hideMobileSidebar } from "../../../store/reducers/sidebar";
import {useWindowSize} from "../../../customHooks/useWindowSize";
import Tooltip from "rc-tooltip";
import 'rc-tooltip/assets/bootstrap.css';
import {showClaimModal} from "../../../store/reducers/transactions/claim";

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

const Sidebar = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [activeClaims, setActiveClaims] = useState(0);
  const [activeStkAtomClaims, setActiveStkAtomClaims] = useState(0);
  const [pendingList, setPendingList] = useState<any>([]);
  const [totalPendingBalance, setTotalPendingBalance] = useState<number>(0);
  const [totalUnListedPendingClaims, setTotalUnlistedPendingClaims] = useState<number>(0);

  const {ibcAtomBalance, stkAtomBalance} = useSelector((state:RootState) => state.balances);
  const {isWalletConnected} = useWallet()
  const {isMobile} = useWindowSize();

  const {claimableBalance, pendingClaimList, claimableStkAtomBalance, unlistedPendingClaimList} =
      useSelector((state:RootState) => state.claimQueries);

  useEffect(()=> {
    setActiveClaims(claimableBalance)
    setPendingList(pendingClaimList)
    setActiveStkAtomClaims(claimableStkAtomBalance)
    let totalPendingClaimableAmount:number = 0;
    if (pendingList.length) {
      pendingList.forEach((item:any) => {
        totalPendingClaimableAmount += item.unbondAmount;
      });
    }
    setTotalPendingBalance(totalPendingClaimableAmount)

    let totalUnlistedPendingClaimableAmount:number = 0;
    if (unlistedPendingClaimList.length) {
      unlistedPendingClaimList.forEach((item:any) => {
        totalUnlistedPendingClaimableAmount += item.unbondAmount;
      });
    }
    setTotalUnlistedPendingClaims(totalUnlistedPendingClaimableAmount)
  },[claimableBalance, pendingClaimList, claimableStkAtomBalance, pendingList, unlistedPendingClaimList])

  const claimHandler = async () => {
    dispatch(hideMobileSidebar())
    dispatch(showClaimModal())
  }

  const closeSideHandler = () => {
    dispatch(hideMobileSidebar())
  }

  const router = useRouter();
  return (
    <aside className="w-[284px] md:w-[220px]">
      <div className={`${Styles.sideBarContent} flex flex-col justify-between overflow-y-auto sticky`}>
        <div>
          <div className="text-center py-[2.1875rem]">
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
                <p className={`${Styles.navBarLink } ${router.pathname == "/" ? `${Styles.active} navItemActive` : "group"} 
                py-3 px-8 flex items-center active:bg-sideBar-navLinkActive cursor-pointer`}
                onClick={isMobile ? closeSideHandler : emptyFunc}>
                  <Icon
                    iconName="staking"
                    viewClass={`${Styles.navBarLinkIcon} side-bar-icon mr-8 md:mr-4 group-hover:fill-[#fcfcfc]`}
                  />
                  <span className="text text-light-mid leading-6 text-base md:text-sm group-hover:text-light-high">Staking</span>
                </p>
              </Link>
            </li>
            <li className={`list-none`}>
              <Link href={"/defi"} passHref>
                <p className={`${Styles.navBarLink } ${router.pathname == "/defi" ? `${Styles.active} navItemActive` : "group"} 
                py-3 px-8 flex items-center cursor-pointer`}
                   onClick={isMobile ? closeSideHandler : emptyFunc}>
                  <Icon
                    iconName="defi"
                    viewClass={`${Styles.navBarLinkIcon} side-bar-icon mr-8 md:mr-4 group-hover:fill-[#fcfcfc]`}
                  />
                  <span className="text text-light-mid leading-6 text-base md:text-sm group-hover:text-light-high">DeFi</span>
                </p>
              </Link>
            </li>
            <li className={`list-none`}>
              <Link href="/" className="nav-link" passHref>
                <p className={`${Styles.navBarLink } ${router.pathname == "/transaction" ? `${Styles.active} navItemActive` : "group"}
                 py-3 px-8 flex items-center cursor-pointer`}
                   onClick={isMobile ? closeSideHandler : emptyFunc}>
                  <Icon
                    iconName="transactions"
                    viewClass={`${Styles.navBarLinkIcon} side-bar-icon mr-8 md:mr-4 group-hover:fill-[#fcfcfc]`}
                  />
                  <span className="text text-light-mid leading-6 text-base md:text-sm group-hover:text-light-high">Transactions</span>
                </p>
              </Link>
            </li>
            <li className={`list-none`}>
              <p onClick={() => setOpen(!open)}
                 aria-controls="more-list"
                 aria-expanded={open}
                 className={`flex items-center justify-between navLink moreListHeader cursor-pointer m-0 
                 ${open ? "opened" : "closed"} py-3 px-8 group`}>
                  <span className="flex items-center">
                      <Icon
                        iconName="more"
                        viewClass={`${Styles.navBarLinkIcon} side-bar-icon mr-8 md:mr-4 group-hover:fill-[#fcfcfc]`}
                      />
                      <span className="text-light-mid leading-6 text-base md:text-sm group-hover:text-light-high">More</span>
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
                <img src={'/images/tokens/stk_atom.svg'} width={24} height={24} alt="atom"/>
                <span className="text-light-mid text-sm leading-5 ml-2.5">stkATOM
                </span>
              </div>
              <p className="text-light-mid text-sm font-medium leading-5">
                {formatNumber(stkAtomBalance, 3, 6)}
              </p>
            </div>
            {ibcAtomBalance > 0 ?
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center">
                    <img src={'/images/tokens/atom.svg'} width={24} height={24} alt="atom"/>
                    <span className="text-light-mid text-sm leading-5 ml-2.5">ATOM</span>
                    <Tooltip placement="bottom" overlay={<span className="text-center block">Withdraw <br/> (ATOM on Persistence)</span>}>
                      <button className="icon-button px-1">
                        <Icon
                            viewClass="arrow-right"
                            iconName="info"/>
                      </button>
                    </Tooltip>
                  </div>
                  <p className="text-light-mid text-sm font-medium leading-5">{formatNumber(ibcAtomBalance, 3, 6)}</p>
                </div> : null
            }
          </div>

          <div className={`${Styles.balanceList} p-6`}>
            <h2 className="text-light-emphasis text-base flex items-center font-semibold leading-normal mb-4">
              Unstaking
               <Tooltip placement="bottom" overlay=
                   {<span>Your assets in the process of <br/>
                      being unstaked, after which  <br/>
                      they can be claimed.</span>}>
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
              <p className="text-light-mid text-sm font-medium leading-5">
                {truncateToFixedDecimalPlaces(Number(decimalize(activeClaims)) +
                    Number(decimalize(totalPendingBalance)) +
                    Number(activeStkAtomClaims))}
              </p>
            </div>
          </div>

          {isWalletConnected && (activeClaims > 0 || totalPendingBalance > 0 || activeStkAtomClaims > 0 || totalUnListedPendingClaims > 0) ?
              <div className={`${Styles.DepositButton} m-auto`}>
                <Button
                    size="medium"
                    type="secondary"
                    content="Claim"
                    className="w-full mb-4  md:text-xsm md:py-2 md:px-4"
                    onClick={claimHandler}/>
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