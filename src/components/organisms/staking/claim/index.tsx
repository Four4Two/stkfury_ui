import React, {useEffect, useState} from "react";
import {Icon} from "../../../atoms/icon";
import {useDispatch, useSelector} from "react-redux";
import styles from './styles.module.css'
import {ClaimMsg} from "../../../../helpers/protoMsg";
import {decimalize, printConsole} from "../../../../helpers/utils";
import {useWallet} from "../../../../context/WalletConnect/WalletConnect";
import {executeClaimTransactionSaga, hideClaimModal} from "../../../../store/reducers/transactions/claim";
import {RootState} from "../../../../store/reducers";
import {CLAIM} from "../../../../../AppConstants";
import {Spinner} from "../../../atoms/spinner";
import {setTransactionProgress} from "../../../../store/reducers/transaction";
import Modal from "../../../molecules/modal";

const IndividualUnstakingClaim = ({index, amount, unstakedOn, daysRemaining}:any) => {
    return (
       <>
           <div className="p-4 rounded-md bg-[#262626] flex items-center justify-between flex-wrap mb-4 " key={index}>
               <div>
                   <p className="amount text-light-low font-normal leading-normal text-lg mb-2">{decimalize(amount)} ATOM</p>
                   <p className="leading-normal text-light-low text-xsm font-normal">{unstakedOn}</p>
               </div>
               <div>
                   <p className="leading-normal text-light-low text-xsm font-normal">{0} days remaining</p>
               </div>
           </div>
       </>
    )
}

const ClaimModal = () => {
    const [expand, setExpand] = useState(false);
    const {showModal} = useSelector((state:RootState) => state.claim);

    const {inProgress, name} = useSelector((state:RootState) => state.transaction);

    const dispatch = useDispatch();

    const {persistenceAccountData, persistenceSigner, persistenceChainData} = useWallet();

    const [activeClaims, setActiveClaims] = useState(0);
    const [pendingList, setPendingList] = useState<any>([]);

    const {claimableBalance, pendingClaimList, claimableStkAtomBalance} = useSelector((state:RootState) => state.claimQueries);

    useEffect(()=>{
        setActiveClaims(claimableBalance)
        setPendingList(pendingClaimList)
    },[claimableBalance, pendingClaimList])

    const claimHandler = async () => {
        const messages = ClaimMsg(persistenceAccountData!.address)
        dispatch(executeClaimTransactionSaga({
            persistenceSigner:persistenceSigner!,
            persistenceChainInfo:persistenceChainData!,
            msg: messages,
            address: persistenceAccountData!.address,
        }))
        dispatch(setTransactionProgress(CLAIM));
    }

    const enable = Number(activeClaims) > 0 || Number(claimableStkAtomBalance) > 0;
    printConsole(activeClaims, "activeClaims");

    const handleClose = () =>{
        dispatch(hideClaimModal())
    }

    return (
        <Modal show={showModal} onClose={handleClose}  className="depositModal" header="Claim Unstaked ATOM">
        <div className='mt-4'>
                <div className="bg-[#101010] rounded-md p-6 md:py-4 px-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium leading-normal text-lg text-light-high md:text-base">
                                    {decimalize(activeClaims)} ATOM
                            </p>
                            {claimableStkAtomBalance > 0 ?
                                <p className="font-medium leading-normal text-lg text-light-high md:text-base">
                                    {decimalize(claimableStkAtomBalance)} stkATOM
                                </p>
                                : null
                            }
                        </div>
                        <p className={`claimButton rounded-md cursor-pointer border-2 border-[#47C28B] border-solid
                         text-sm text-light-high px-[6.4px] py-[6.4px] w-[86px] text-center 
                         ${(!enable || (name === CLAIM && inProgress)) ? 'opacity-50 pointer-events-none': ''}`}
                           onClick={claimHandler}>
                            {(name === CLAIM && inProgress) ? <Spinner width={1.5}/> : 'Claim'}
                        </p>
                    </div>
                </div>
                <div className="mt-5">
                    <p onClick={() => setExpand(!expand)}
                       className={`unStakeListHeader mb-4 cursor-pointer flex items-center justify-between ${expand ? "opened" : "closed"}`}>
                        <span className="font-semibold text-lg leading-normal text-light-high m-0 md:text-base">
                            Unstaking in Progress
                        </span>
                        <Icon
                            iconName="right-arrow"
                            viewClass={`${styles.collapseIcon} collapseIcon`}
                        />
                    </p>
                    <div className={`${expand ? 'active': ''} unStakeList overflow-hidden max-h-0`}>
                        {
                            pendingList.length ?
                            pendingList.map((item:any, index:number) => {
                                return(
                                    <IndividualUnstakingClaim
                                        key={index}
                                        amount={item.unbondAmount}
                                        unstakedOn={item.unStakedon}
                                        daysRemaining={item.daysRemaining}/>
                                )
                            })
                                :
                                <p className="mb-3 text-light-low text-sm leading-normal font-normal md:text-xsm">
                                    No pending unbondings found
                                </p>
                        }
                    </div>
                </div>
        </div>
        </Modal>
    );
};


export default ClaimModal;
