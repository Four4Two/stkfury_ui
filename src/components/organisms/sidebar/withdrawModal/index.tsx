import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/reducers";
import Modal from "../../../molecules/modal";
import {
    hideWithdrawModal, setWithdrawAmount,
    setWithdrawTxnFailed,
    setWithdrawTxnStepNumber
} from "../../../../store/reducers/transactions/withdraw";
import {Icon} from "../../../atoms/icon";
import styles from "../../staking/stake/styles.module.css";
import TransactionIcon from "../../../molecules/transactionHelper/transactiosIcon";
import {resetTransaction} from "../../../../store/reducers/transaction";
import Button from "../../../atoms/button";
import Submit from "./submit";

const WithdrawModal = () => {
    const dispatch = useDispatch();
    const {showModal, txFailed, stepNumber, amount} = useSelector((state:RootState) => state.withdraw);

    const handleClose = () => {
        dispatch(setWithdrawTxnStepNumber(0))
        dispatch(setWithdrawTxnFailed(false))
        dispatch(hideWithdrawModal())
        dispatch(setWithdrawAmount(0))
    }

    useEffect(() => {
        if(showModal && txFailed) {
            dispatch(resetTransaction())
        }
    },[txFailed, showModal, dispatch])

    return (
        <Modal show={showModal} onClose={handleClose}
               className="stakeModal" staticBackDrop={false} closeButton={false}>
            <div className="flex items-center justify-center px-8 pt-8">
                <div className="w-[60px] h-[60px] md:w-[46px] md:h-[46px] bg-[#000] rounded-full flex items-center justify-center">
                    <img src={'/images/tokens/stk_atom.svg'}
                         className="logo w-[40px] h-[40px] md:w-[26px] md:h-[26px]"
                         alt="atomIcon"
                    />
                </div>
                <Icon
                    iconName="right-arrow-bold"
                    viewClass="icon-arrow mx-4"
                />
                <div className="w-[60px] h-[60px] md:w-[46px] md:h-[46px] bg-[#000] rounded-full flex items-center justify-center">
                    <img src={'/images/keplr_round.svg'}
                         className="logo w-[40px] h-[40px] md:w-[26px] md:h-[26px]"
                         alt="atomIcon"
                    />
                </div>
            </div>
            <p className="text-light-high text-center font-semibold text-lg leading normal px-8 md:text-base">
                Withdrawing {amount} ATOM from Peristence to your Keplr wallet
            </p>
            <div className={`${styles.stakeModalBody} p-8`}>
                <div className="mb-8">
                    <div className="flex items-center mb-5">
                        <div className="mr-3">
                            {
                                TransactionIcon(stepNumber, 1, txFailed)
                            }
                        </div>
                        <p className={`${stepNumber >= 1 ? "text-light-emphasis": "text-light-low"} text-base font-normal`}>
                            Approve wallet transfer
                        </p>
                    </div>
                    <div className="flex items-center mb-5">
                        <div className="mr-3">
                            {
                                TransactionIcon(stepNumber, 2, txFailed)
                            }
                        </div>
                        <p className={`${stepNumber >= 2 ? "text-light-emphasis": "text-light-low"} text-base font-normal`}>
                            Send ATOM to your Keplr wallet
                        </p>
                    </div>
                </div>
                {txFailed ?
                    <p className="text-base text-light-high text-center font-semibold mb-4">
                        Transfer could not be completed.
                    </p> : null
                }
                {
                    stepNumber === 3 &&
                    <p className="text-base text-light-high text-center font-semibold mb-4 animate-pulse">
                        You withdraw {amount} ATOM on pSTAKE successfully!
                    </p>
                }
                {
                    (txFailed && stepNumber !== 1) || stepNumber === 3  ?
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

export default WithdrawModal;
