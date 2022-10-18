import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import Button from "../../../atoms/button";
import { RootState } from "../../../../store/reducers";
import { useWallet } from "../../../../context/WalletConnect/WalletConnect";
import { Spinner } from "../../../atoms/spinner";
import {LiquidUnStakeMsg, LiquidUnStakeMsgTypes, RedeemMsg} from "../../../../helpers/protoMsg";
import {truncateToFixedDecimalPlaces, unDecimalize} from "../../../../helpers/utils";
import {COSMOS_CHAIN_ID, INSTANT, STK_ATOM_MINIMAL_DENOM, UN_STAKE} from "../../../../../AppConstants";
import { executeUnStakeTransactionSaga } from "../../../../store/reducers/transactions/unstake";
import {setTransactionProgress} from "../../../../store/reducers/transaction";
import {MakeIBCTransferMsg} from "../../../../helpers/transaction";
import {IBCChainInfos, IBCConfiguration} from "../../../../helpers/config";

const env:string = process.env.NEXT_PUBLIC_ENVIRONMENT!;

const Submit = () => {
  const dispatch = useDispatch();
  let ibcInfo = IBCChainInfos[env].find(chain => chain.counterpartyChainId === COSMOS_CHAIN_ID);
  const {stkAtomBalance, atomBalance} = useSelector((state:RootState) => state.balances);
  const {amount, type} = useSelector((state:RootState) => state.unStake);
  const {inProgress, name} = useSelector((state:RootState) => state.transaction);
  const {redeemFee, exchangeRate} = useSelector((state:RootState) => state.initialData)

  const atomAmount = Number(amount) / exchangeRate

  const {connect, isWalletConnected, persistenceAccountData, persistenceSigner , persistenceChainData,
    cosmosAccountData, cosmosChainData} = useWallet()

  const amountFee:number = truncateToFixedDecimalPlaces(Number(atomAmount) - (Number(atomAmount) * redeemFee));

  console.log(amountFee, "amountFee", atomAmount, (Number(atomAmount) * redeemFee))
  const stakeHandler = async () => {
    let messages:LiquidUnStakeMsgTypes[];
    let pollingBalance;
    dispatch(setTransactionProgress(UN_STAKE));
    if(type === INSTANT) {
      const withDrawMsg = await MakeIBCTransferMsg({
        channel: ibcInfo?.destinationChannelId,
        fromAddress: persistenceAccountData?.address,
        toAddress: cosmosAccountData?.address,
        amount: unDecimalize(amountFee),
        timeoutHeight: undefined,
        timeoutTimestamp: undefined,
        denom: ibcInfo?.coinDenom,
        sourceRPCUrl: persistenceChainData?.rpc,
        destinationRPCUrl: cosmosChainData?.rpc,
        port: IBCConfiguration.ibcDefaultPort});
        const redeemMsg = RedeemMsg(persistenceAccountData!.address, unDecimalize(amount), STK_ATOM_MINIMAL_DENOM)
      pollingBalance = atomBalance;
        messages = [redeemMsg, withDrawMsg]
    }else{
      const liquidUnStakeMsg = LiquidUnStakeMsg(persistenceAccountData!.address, unDecimalize(amount), STK_ATOM_MINIMAL_DENOM)
      pollingBalance = stkAtomBalance;
      messages = [liquidUnStakeMsg]
    }

    dispatch(executeUnStakeTransactionSaga({
      persistenceSigner:persistenceSigner!,
      msg: messages,
      address: persistenceAccountData!.address,
      persistenceChainInfo:persistenceChainData!,
      pollInitialBalance:pollingBalance,
      cosmosAddress: cosmosAccountData?.address!,
      cosmosChainInfo: cosmosChainData!
    }))
  }

  const enable = amount && (Number(amount) > 0) && (Number(amount) <= Number(stkAtomBalance))
  return (
    isWalletConnected ?
      <Button
        className={`${(name === UN_STAKE && inProgress) ? '!py-[0.8125rem]' : ''} button w-full 
         md:py-2 md:text-sm flex items-center justify-center`}
        type="primary"
        size="large"
        disabled={!enable || (name === UN_STAKE && inProgress)}
        content={(name === UN_STAKE && inProgress) ? <Spinner size={"medium"} /> :
          type === INSTANT ?
            "Redeem Instantly" : "Unstake"
      }
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

