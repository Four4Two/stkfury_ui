import React, {useEffect} from "react";
import Modal from "../../../../molecules/modal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../store/reducers";
import {Icon} from "../../../../atoms/icon";
import {
    hideStakeModal,
    setStakeTxnStepNumber,
    setStakeTxnFailed,
    setStakeAmount
} from "../../../../../store/reducers/transactions/stake";
import Submit from "./submit";
import styles from "../styles.module.css";
import Button from "../../../../atoms/button";
import {resetTransaction} from "../../../../../store/reducers/transaction";
import TransactionIcon from "../../../../molecules/transactionHelper/transactiosIcon";
import {useWindowSize} from "../../../../../customHooks/useWindowSize";


const StakeModal = () => {
    const dispatch = useDispatch();
    const {showModal, txFailed, stepNumber} = useSelector((state:RootState) => state.stake);
    const {amount} = useSelector((state:RootState) => state.stake);
    const { isMobile } = useWindowSize();

    const handleClose = () => {
        dispatch(setStakeTxnStepNumber(0))
        dispatch(setStakeTxnFailed(false))
        dispatch(hideStakeModal())
        dispatch(setStakeAmount(""))
    }

    useEffect(()=>{
        if(showModal && txFailed) {
            dispatch(resetTransaction())
        }
    },[txFailed, showModal, dispatch])

    return (
        <Modal show={showModal} onClose={handleClose}
               className="stakeModal" staticBackDrop={false} closeButton={false}>
            <div className="flex items-center justify-center px-8 pt-8">
               <div className="w-[60px] h-[60px] md:w-[46px] md:h-[46px] bg-[#000] rounded-full flex items-center justify-center">
                   <img src={'/images/tokens/atom.svg'}
                        className="logo w-[40px] h-[40px] md:w-[26px] md:h-[26px]"
                        alt="atomIcon"
                   />
               </div>
                <Icon
                    iconName="right-arrow-bold"
                    viewClass="icon-arrow mx-4"
                />
                <div className="w-[60px] h-[60px] md:w-[46px] md:h-[46px] bg-[#000] rounded-full flex items-center justify-center">
                <img src={'/images/tokens/stk_atom.svg'}
                     className="logo w-[40px] h-[40px] md:w-[26px] md:h-[26px]"
                     alt="atomIcon"
                />
                </div>
            </div>
            <p className="text-light-high text-center font-semibold text-lg leading normal px-8 md:text-base">
                Liquid Staking {amount} ATOM
            </p>
            <div className={`${styles.stakeModalBody} p-8`}>
                <div className="mb-8">
                    <div className="flex items-center mb-5 md:mb-3">
                        <div className="mr-3">
                            {
                                TransactionIcon(stepNumber, 1, txFailed)
                            }
                        </div>
                        <p className={`${stepNumber >= 1 ? "text-light-emphasis": "text-light-low"} text-base font-normal`}>
                            Approve wallet transfer
                        </p>
                    </div>
                    <div className="flex items-center mb-5 md:mb-3">
                        <div className="mr-3">
                            {
                                TransactionIcon(stepNumber, 2, txFailed)
                            }
                        </div>
                        <p className={`${stepNumber >= 2 ? "text-light-emphasis": "text-light-low"} text-base font-normal`}>
                            Send ATOM to pSTAKE via IBC
                        </p>
                    </div>
                    <div className="flex items-center mb-5 md:mb-3">
                        <div className="mr-3">
                            {
                                TransactionIcon(stepNumber, 3, txFailed)
                            }
                        </div>
                        <p className={`${stepNumber >= 3 ? "text-light-emphasis": "text-light-low"} text-base font-normal`}>
                            Approve staking with pSTAKE
                        </p>
                    </div>
                    <div className="flex items-center mb-5 md:mb-3">
                        <div className="mr-3">
                            {
                                TransactionIcon(stepNumber, 4, txFailed)
                            }
                        </div>
                        <p className={`${stepNumber >= 4 ? "text-light-emphasis": "text-light-low"} text-base font-normal`}>
                            Liquid Stake ATOM and get stkATOM
                        </p>
                    </div>
                </div>

                {txFailed ?
                    <p className="text-base text-light-high text-center font-semibold mb-4 md:mb-3">
                        Transfer could not be completed.
                    </p> : null
                }
                {
                    stepNumber === 5 &&
                    <p className="text-base text-light-high text-center font-semibold mb-4 animate-pulse">
                        You staked {amount} ATOM on pSTAKE successfully!
                    </p>
                }
                {
                   (txFailed && stepNumber !== 1) || stepNumber === 5  ?
                        <Button
                            className="button w-full md:py-2 md:text-sm flex items-center justify-center w-[350px] mx-auto"
                            type="primary"
                            size="medium"
                            content="Done"
                            onClick={handleClose}
                        />
                        :
                        <Submit/>
                }
               
            </div>
        </Modal>
    );
};


export default StakeModal;