import React, {useState} from "react";
import {Icon} from "../../../atoms/icon";
import {useDispatch} from "react-redux";
import styles from './styles.module.css'
import {displayToast} from "../../../molecules/toast";
import {ClaimMsg, LiquidStakeMsg} from "../../../../helpers/protoMsg";
import {unDecimalize} from "../../../../helpers/utils";
import {executeStakeTransactionSaga} from "../../../../store/reducers/transactions/stake";
import {useWallet} from "../../../../context/WalletConnect/WalletConnect";
import {executeClaimTransactionSaga} from "../../../../store/reducers/transactions/claim";

const IndividualUnstakingClaim = ({amount, daysRemaining, unstakedOn}:any) => {
    return (
       <>
           <div className="p-4 rounded-md bg-[#262626] flex items-center justify-between flex-wrap mb-4 ">
               <div>
                   <p className="amount text-light-low font-normal leading-normal text-lg mb-2">{amount} ATOM</p>
                   <p className="leading-normal text-light-low text-xsm font-normal">{unstakedOn}</p>
               </div>
               <div>
                   <p className="leading-normal text-light-low text-xsm font-normal">{daysRemaining} days remaining</p>
               </div>
           </div>
       </>
    )
}

const Claim = () => {
    const [expand, setExpand] = useState(false);
    const dispatch = useDispatch();

    let activeClaim = 0

    const {persistenceAccountData, persistenceSigner, persistenceChainData} = useWallet();

    const claimHandler = async () => {
        const messages = ClaimMsg(persistenceAccountData!.address)
        dispatch(executeClaimTransactionSaga({
            persistenceSigner:persistenceSigner!,
            persistenceChainInfo:persistenceChainData!,
            msg: messages,
            address: persistenceAccountData!.address,
        }))
    }

    return (
        <div className='mt-4'>
            <div className='p-6 bg-tabHeader rounded-md'>
                <p className="mb-4 text-lg font-semibold leading-normal text-light-high md:text-base md:mb-2">
                    Claim Unstaked stkATOM
                </p>
                <p className="mb-3 text-light-low text-sm leading-normal font-normal md:text-xsm">
                    Select the unstaked amount you would like to claim.
                </p>
                <div className="bg-[#101010] rounded-md p-6 md:py-4 px-6">
                    <div className="flex items-center justify-between">
                        <p className="font-medium leading-normal text-lg text-light-high md:text-base">
                            {activeClaim} ATOM
                        </p>
                        <p className="rounded-md cursor-pointer border-2 border-[#47C28B] border-solid text-sm text-light-high px-5 py-1.5"
                           onClick={claimHandler}>
                            Claim
                        </p>
                    </div>
                </div>

                <div className="mt-5">
                    <p onClick={() => setExpand(!expand)}
                       className={`mb-4 cursor-pointer flex items-center justify-between ${expand ? "opened" : "closed"}`}>
                        <span className="font-semibold text-lg leading-normal text-light-high m-0 md:text-base">
                            Unstaking in Progress
                        </span>
                        <Icon
                            iconName="right-arrow"
                            viewClass={styles.collapseIcon}
                        />
                    </p>
                    <div className={`${expand ? '': 'active'} unStakeList overflow-hidden max-h-0`}>
                            <IndividualUnstakingClaim amount={200.899326} daysRemaining={1}
                                                      unstakedOn={'Unstaked on 19 Aug 2022, 9:12 UTC'}/>
                    </div>
                </div>
            </div>
        </div>

    );
};


export default Claim;
