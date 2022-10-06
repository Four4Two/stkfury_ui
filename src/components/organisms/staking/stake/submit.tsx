import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import Button from "../../../atoms/button";
import { RootState } from "../../../../store/reducers";
import { useWallet } from "../../../../context/WalletConnect/WalletConnect";
import { Spinner } from "../../../atoms/spinner";
import { LiquidStakeMsg } from "../../../../helpers/protoMsg";
import { unDecimalize } from "../../../../helpers/utils";
import { IBCChainInfos } from '../../../../helpers/config';
import {COSMOS_CHAIN_ID, STAKE} from "../../../../../AppConstants";
import { executeStakeTransactionSaga } from "../../../../store/reducers/transactions/stake";
import {setTransactionProgress} from "../../../../store/reducers/transaction";

const env:string = process.env.NEXT_PUBLIC_ENVIRONMENT!;

const Submit = () => {
  const dispatch = useDispatch();
  let ibcInfo = IBCChainInfos[env].find(chain => chain.counterpartyChainId === COSMOS_CHAIN_ID);
  const {atomBalance, stkAtomBalance} = useSelector((state:RootState) => state.balances);
  const {amount} = useSelector((state:RootState) => state.stake);
  const {inProgress, name} = useSelector((state:RootState) => state.transaction);
  const {connect, isWalletConnected, persistenceAccountData, persistenceSigner , persistenceChainData} = useWallet()

  const stakeHandler = async () => {
    const messages = LiquidStakeMsg(persistenceAccountData!.address, unDecimalize(amount), ibcInfo!.coinDenom)
    dispatch(executeStakeTransactionSaga({
      persistenceSigner:persistenceSigner!,
      msg: messages,
      account: persistenceAccountData!.address,
      persistenceChainInfo:persistenceChainData!,
      pollInitialBalance: stkAtomBalance
    }))
    dispatch(setTransactionProgress(STAKE));
  }

  const enable = amount && (Number(amount) > 0) && (Number(amount) <= Number(atomBalance))

  return (
    isWalletConnected ?
      <Button
        className={`${(name === STAKE && inProgress) ? '!py-[0.8125rem]' : ''} button w-full md:py-2 md:text-sm flex items-center justify-center`}
        type="primary"
        size="large"
        disabled={!enable || (name === STAKE && inProgress)}
        content={(name === STAKE && inProgress) ? <Spinner width={1.5}/> : 'Stake'}
        onClick={stakeHandler}
      />
      :
      <Button
        className="button w-full md:py-2 md:text-sm"
        type="primary"
        size="large"
        disabled={false}
        onClick={connect}
        content="Connect wallet"
      />

  );
};


export default Submit;

