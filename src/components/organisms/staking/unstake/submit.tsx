import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import Button from "../../../atoms/button";
import { RootState } from "../../../../store/reducers";
import { useWallet } from "../../../../context/WalletConnect/WalletConnect";
import { Spinner } from "../../../atoms/spinner";
import { LiquidUnStakeMsg, RedeemMsg } from "../../../../helpers/protoMsg";
import {printConsole, unDecimalize} from "../../../../helpers/utils";
import {INSTANT, STK_ATOM_MINIMAL_DENOM, UN_STAKE} from "../../../../../AppConstants";
import { executeUnStakeTransactionSaga } from "../../../../store/reducers/transactions/unstake";
import {setTransactionProgress} from "../../../../store/reducers/transaction";


const Submit = () => {
  const dispatch = useDispatch();
  const {stkAtomBalance} = useSelector((state:RootState) => state.balances);
  const {amount, type} = useSelector((state:RootState) => state.unStake);
  const {inProgress, name} = useSelector((state:RootState) => state.transaction);
  const {connect, isWalletConnected, persistenceAccountData, persistenceSigner , persistenceChainData} = useWallet()

  const stakeHandler = async () => {
    let messages;
    if(type === INSTANT){
       messages = RedeemMsg(persistenceAccountData!.address, unDecimalize(amount), STK_ATOM_MINIMAL_DENOM)
    }else{
       messages = LiquidUnStakeMsg(persistenceAccountData!.address, unDecimalize(amount), STK_ATOM_MINIMAL_DENOM)
    }
    printConsole(messages+'stakeHandler'+type,);
    dispatch(executeUnStakeTransactionSaga({
      persistenceSigner:persistenceSigner!,
      msg: messages,
      address: persistenceAccountData!.address,
      persistenceChainInfo:persistenceChainData!
    }))
      dispatch(setTransactionProgress(UN_STAKE));
  }

  const enable = amount && (Number(amount) > 0) && (Number(amount) <= Number(stkAtomBalance))

  return (
    isWalletConnected ?
      <Button
        className={`${(name === UN_STAKE && inProgress) ? '!py-[0.8125rem]' : ''} button w-full  md:py-2 md:text-smx flex items-center justify-center`}
        type="primary"
        size="large"
        disabled={!enable || (name === UN_STAKE && inProgress)}
        content={(name === UN_STAKE && inProgress) ? <Spinner width={1.5} /> :
          type === INSTANT ?
            "Redeem Instantly" : "Unstake"
      }
        onClick={stakeHandler}
      />
      :
      <Button
        className="button w-full  md:py-2 md:text-sm"
        type="primary"
        size="large"
        disabled={false}
        onClick={connect}
        content="Connect wallet"
      />

  );
};


export default Submit;

