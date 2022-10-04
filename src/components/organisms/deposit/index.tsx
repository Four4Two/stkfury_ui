import React  from "react";
import Modal from "../../molecules/modal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/reducers";
import {hideDepositModal } from "../../../store/reducers/transactions/deposit";
import { useWallet } from "../../../context/WalletConnect/WalletConnect";
import From from "./from";
import Submit from "./submit";

const Deposit = () => {
  const dispatch = useDispatch();
  const {showModal} = useSelector((state:RootState) => state.deposit);
  const {cosmosAccountData, persistenceAccountData} = useWallet();

  const handleClose = () =>{
    dispatch(hideDepositModal())
  }

  return (
    <Modal show={showModal} onClose={handleClose} className="depositModal" header="Deposit Atom">
      <p className="title font-bold font-xl leading-normal text-light-emphasis">IBC Transfer</p>
      <div>
        <p className="font-semibold text-sm leading-normal text-light-emphasis mb-1">
          From Address
        </p>
        <p className="font-semibold text-sm leading-normal text-light-mid">
          {cosmosAccountData?.address}
        </p>
      </div>
      <div>
        <p className="font-semibold text-sm leading-normal text-light-emphasis mb-1">
          To Address
        </p>
        <p className="font-semibold text-sm leading-normal text-light-mid">
          {persistenceAccountData?.address}
        </p>
      </div>
      <From/>
      <Submit/>
    </Modal>
  );
};


export default Deposit;
