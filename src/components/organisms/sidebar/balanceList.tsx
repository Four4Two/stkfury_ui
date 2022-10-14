import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/reducers";
import Styles from "./styles.module.css";
import Tooltip from "rc-tooltip";
import {Icon} from "../../atoms/icon";
import {decimalize, formatNumber, truncateToFixedDecimalPlaces} from "../../../helpers/utils";
import Button from "../../atoms/button";
import {hideMobileSidebar} from "../../../store/reducers/sidebar";
import {showClaimModal} from "../../../store/reducers/transactions/claim";
import {setWithdrawAmount, showWithdrawModal} from "../../../store/reducers/transactions/withdraw";
import {useWallet} from "../../../context/WalletConnect/WalletConnect";
import {DEPOSIT, STAKE, WITHDRAW} from "../../../../AppConstants";
import {Spinner} from "../../atoms/spinner";

const BalanceList = () => {
    const dispatch = useDispatch();
    const [activeClaims, setActiveClaims] = useState<number>(0);
    const [activeStkAtomClaims, setActiveStkAtomClaims] = useState<number>(0);
    const [pendingList, setPendingList] = useState<any>([]);
    const [totalPendingBalance, setTotalPendingBalance] = useState<number>(0);
    const [totalUnListedPendingClaims, setTotalUnlistedPendingClaims] = useState<number>(0);
    const {ibcAtomBalance, stkAtomBalance} = useSelector((state:RootState) => state.balances);
    const {isWalletConnected} = useWallet()
    const {inProgress, name} = useSelector((state:RootState) => state.transaction);
    const {showModal} = useSelector((state:RootState) => state.withdraw);

    const {claimableBalance, pendingClaimList, claimableStkAtomBalance, unlistedPendingClaimList} =
        useSelector((state:RootState) => state.claimQueries);


    const claimHandler = async () => {
        dispatch(hideMobileSidebar())
        dispatch(showClaimModal())
    }

    const withdrawHandler = async () => {
        dispatch(hideMobileSidebar())
        dispatch(showWithdrawModal())
        dispatch(setWithdrawAmount(ibcAtomBalance))
    }

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

    return (
        <>
            <div className={`${Styles.balanceList} px-6 py-5`}>
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
                    <>
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
                        </div>
                        <div className={`m-auto w-[220px] md:w-auto`}>
                            <Button
                                size="small"
                                type="secondary"
                                content={
                                    (name === WITHDRAW && inProgress && !showModal) ?
                                        <Spinner size={"small"}/>
                                        :
                                         'Withdraw'
                                }
                                disabled={(name === WITHDRAW && inProgress)}
                                className="w-full mt-6 md:text-xsm md:py-2 md:px-4"
                                onClick={withdrawHandler}/>
                        </div>
                    </>

                    : null
                }
            </div>

            <div className={`${Styles.balanceList} px-6 py-5`}>
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
                {isWalletConnected && (activeClaims > 0 || totalPendingBalance > 0
                    || activeStkAtomClaims > 0 || totalUnListedPendingClaims > 0) ?
                    <div className={`m-auto w-[220px] md:w-auto`}>
                        <Button
                            size="small"
                            type="secondary"
                            content="Claim"
                            className="w-full mt-4 md:text-xsm md:py-2 md:px-4"
                            onClick={claimHandler}/>
                    </div>
                    : ""
                }

            </div>
        </>
    )
};

export default BalanceList;
