import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import Button from "../../atoms/button";
import { RootState } from "../../../store/reducers";
import { useWallet } from "../../../context/WalletConnect/WalletConnect";
import { Spinner } from "../../atoms/spinner";
import { unDecimalize } from "../../../helpers/utils";
import { IBCChainInfos, IBCConfiguration } from "../../../helpers/config";
import { COSMOS_CHAIN_ID, DEPOSIT, UN_STAKE } from "../../../../AppConstants";
import { MakeIBCTransferMsg } from "../../../helpers/transaction";
import { executeDepositTransactionSaga } from "../../../store/reducers/transactions/deposit";

const env:string = process.env.NEXT_PUBLIC_ENVIRONMENT!;

const Submit = () => {
  const dispatch = useDispatch();
  let ibcInfo = IBCChainInfos[env].find(chain => chain.counterpartyChainId === COSMOS_CHAIN_ID);
  const {ibcAtomBalance} = useSelector((state:RootState) => state.balances);
  const {amount} = useSelector((state:RootState) => state.deposit);
  const {inProgress, name} = useSelector((state:RootState) => state.transaction);
  const {persistenceAccountData, cosmosSigner, persistenceChainData, cosmosAccountData, cosmosChainData} = useWallet()

  const depositHandler = async () => {
    let msg = await MakeIBCTransferMsg({
      channel: ibcInfo?.sourceChannelId,
      fromAddress: cosmosAccountData?.address,
      toAddress: persistenceAccountData?.address,
      amount: unDecimalize(amount),
      timeoutHeight: undefined,
      timeoutTimestamp: undefined,
      denom: cosmosChainData?.stakeCurrency.coinMinimalDenom,
      sourceRPCUrl: cosmosChainData?.rpc,
      destinationRPCUrl: persistenceChainData?.rpc,
      port: IBCConfiguration.ibcDefaultPort});
    dispatch(executeDepositTransactionSaga({
      cosmosSigner:cosmosSigner!,
      cosmosChainInfo: cosmosChainData!,
      persistenceChainInfo: persistenceChainData!,
      cosmosAddress:cosmosAccountData!.address,
      persistenceAddress:persistenceAccountData!.address,
      msg:msg
    }))
  }

  const enable = amount && (Number(amount) > 0) && (Number(amount) < Number(ibcAtomBalance))

  return (
      <Button
        className="button w-full  md:py-2 md:text-sm"
        type="primary"
        size="large"
        disabled={!enable}
        content={(name === DEPOSIT && inProgress) ? <Spinner/> : 'Deposit'}
        onClick={depositHandler}
      />
  );
};


export default Submit;

