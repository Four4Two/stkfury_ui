import React, {useState} from "react";
import Modal from "../../../../molecules/modal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../store/reducers";
import {Icon} from "../../../../atoms/icon";
import {hideStakeModal, setStakeTxnStepNumber, setStakeTxnFailed} from "../../../../../store/reducers/transactions/stake";
import Submit from "./submit";
import styles from "../styles.module.css";

const fetchIcon = (stepNumber:number, value:number, txFailed:boolean)=>{
    console.log(stepNumber, value, txFailed, "txFailed");
    return(
        stepNumber < value?
            <Icon
                iconName="success-circle"
                viewClass="icon-arrow fill-[#787878] !w-[1.5rem] !h-[1.5rem]"
            />
            :
            stepNumber === value ?
                txFailed ?
                    <Icon
                        iconName="error"
                        viewClass="icon-error  !w-[1.5rem] !h-[1.5rem]"
                    />
                    :
                    <div className="spinnerSecondary relative flex items-center justify-center w-[1.5rem] h-[1.5rem] after:content-[''] after:absolute after:left-0
                after:top-0 after:w-full after:h-full ">
                        <Icon
                            iconName="tick"
                            viewClass="icon-arrow fill-[#787878]"
                        />
                    </div>
                :
                <Icon
                    iconName="success-circle"
                    viewClass="icon-arrow fill-[#47C28B] !w-[1.5rem] !h-[1.5rem]"
                />
    )
}

const StakeModal = () => {
    const dispatch = useDispatch();
    const {showModal, txFailed, stepNumber} = useSelector((state:RootState) => state.stake);
    const {inProgress, name} = useSelector((state:RootState) => state.transaction);
    const {amount} = useSelector((state:RootState) => state.stake);

    const handleClose = () => {
        dispatch(setStakeTxnStepNumber(0))
        dispatch(setStakeTxnFailed(false))
        dispatch(hideStakeModal())
    }

    return (
        <Modal show={showModal} onClose={handleClose}
               className="stakeModal">
            <div className="flex items-center justify-center px-8 pt-8">
                <img src={'/images/tokens/atom.svg'}
                     className="logo"
                     alt="atomIcon"
                />
                <Icon
                    iconName="right-arrow-bold"
                    viewClass="icon-arrow mx-4"
                />
                <img src={'/images/tokens/stk_atom.svg'}
                     className="logo"
                     alt="atomIcon"
                />
            </div>
            <p className="text-light-high text-center font-semibold text-lg leading normal px-8">
                Liquid Staking {amount} ATOM
            </p>
            <div className={`${styles.stakeModalBody} p-8`}>
                <div className="mb-8">
                    <div className="flex items-center mb-5">
                        <div className="mr-3">
                            {
                                fetchIcon(stepNumber, 1, txFailed)
                            }
                        </div>
                        <p className={`${stepNumber >= 1 ? "text-light-emphasis": "text-light-low"} text-base font-normal`}>
                            Approve wallet transfer
                        </p>
                    </div>
                    <div className="flex items-center mb-5">
                        <div className="mr-3">
                            {
                                fetchIcon(stepNumber, 2, txFailed)
                            }
                        </div>
                        <p className={`${stepNumber >= 2 ? "text-light-emphasis": "text-light-low"} text-base font-normal`}>
                            Send ATOM to pSTAKE via IBC
                        </p>
                    </div>
                    <div className="flex items-center mb-5">
                        <div className="mr-3">
                            {
                                fetchIcon(stepNumber, 3, txFailed)
                            }
                        </div>
                        <p className={`${stepNumber >= 3 ? "text-light-emphasis": "text-light-low"} text-base font-normal`}>
                            Approve staking with pSTAKE
                        </p>
                    </div>
                    <div className="flex items-center mb-5">
                        <div className="mr-3">
                            {
                                fetchIcon(stepNumber, 4, txFailed)
                            }
                        </div>
                        <p className={`${stepNumber >= 4 ? "text-light-emphasis": "text-light-low"} text-base font-normal`}>
                            Liquid Stake ATOM and get stkATOM
                        </p>
                    </div>
                </div>
                {
                    stepNumber === 5 ?
                        <p className="text-base text-light-high text-center font-semibold mb-4 animate-pulse">
                            You staked {amount} ATOM on pSTAKE successfully!
                        </p> : null
                }
                <Submit/>
            </div>

        </Modal>
    );
};


export default StakeModal;