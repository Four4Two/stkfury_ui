import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import Button from "../../../atoms/button";
import { RootState } from "../../../../store/reducers";
import { useWallet } from "../../../../context/WalletConnect/WalletConnect";
import { Spinner } from "../../../atoms/spinner";
import { LiquidUnStakeMsg, RedeemMsg } from "../../../../helpers/protoMsg";
import { unDecimalize } from "../../../../helpers/utils";
import { IBCChainInfos } from '../../../../helpers/config';
import {COSMOS_CHAIN_ID, INSTANT, STK_ATOM_MINIMAL_DENOM, UN_STAKE} from "../../../../../AppConstants";
import { executeStakeTransactionSaga } from "../../../../store/reducers/transactions/stake";
import { executeUnStakeTransactionSaga } from "../../../../store/reducers/transactions/unstake";


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
    dispatch(executeUnStakeTransactionSaga({
      persistenceSigner:persistenceSigner!,
      msg: messages,
      address: persistenceAccountData!.address,
      persistenceChainInfo:persistenceChainData!
    }))
  }

  const enable = amount && (Number(amount) > 0) && (Number(amount) <= Number(stkAtomBalance))

  return (
    isWalletConnected ?
      <Button
        className="button w-full  md:py-2 md:text-smx flex items-center justify-center"
        type="primary"
        size="large"
        disabled={!enable}
        content={(name === UN_STAKE && inProgress) ? <Spinner/> :
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

