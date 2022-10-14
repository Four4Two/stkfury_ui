import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import Button from "../../../atoms/button";
import { RootState } from "../../../../store/reducers";
import { useWallet } from "../../../../context/WalletConnect/WalletConnect";
import { Spinner } from "../../../atoms/spinner";
import { LiquidStakeMsg } from "../../../../helpers/protoMsg";
import { unDecimalize } from "../../../../helpers/utils";
import {IBCChainInfos, IBCConfiguration} from '../../../../helpers/config';
import {COSMOS_CHAIN_ID, DEPOSIT, STAKE, WITHDRAW} from "../../../../../AppConstants";
import {setTransactionProgress} from "../../../../store/reducers/transaction";
import {MakeIBCTransferMsg} from "../../../../helpers/transaction";
import {executeWithdrawTransactionSaga, setWithdrawTxnFailed} from "../../../../store/reducers/transactions/withdraw";

const env:string = process.env.NEXT_PUBLIC_ENVIRONMENT!;

const Submit = () => {
    const dispatch = useDispatch();
    let ibcInfo = IBCChainInfos[env].find(chain => chain.counterpartyChainId === COSMOS_CHAIN_ID);
    const {atomBalance, ibcAtomBalance} = useSelector((state:RootState) => state.balances);
    const {txFailed, stepNumber} = useSelector((state:RootState) => state.withdraw);
    const {inProgress, name} = useSelector((state:RootState) => state.transaction);
    const {cosmosAccountData, cosmosChainData, persistenceAccountData,
        persistenceSigner , persistenceChainData} = useWallet()

    const stakeHandler = async () => {
        dispatch(setWithdrawTxnFailed(false))
        dispatch(setTransactionProgress(WITHDRAW));
        const withDrawMsg = await MakeIBCTransferMsg({
            channel: ibcInfo?.destinationChannelId,
            fromAddress: persistenceAccountData?.address,
            toAddress: cosmosAccountData?.address,
            amount: unDecimalize(ibcAtomBalance),
            timeoutHeight: undefined,
            timeoutTimestamp: undefined,
            denom: ibcInfo?.coinDenom,
            sourceRPCUrl: persistenceChainData?.rpc,
            destinationRPCUrl: cosmosChainData?.rpc,
            port: IBCConfiguration.ibcDefaultPort});

        dispatch(executeWithdrawTransactionSaga({
            cosmosChainInfo: cosmosChainData!,
            persistenceChainInfo: persistenceChainData!,
            cosmosAddress:cosmosAccountData?.address!,
            persistenceAddress:persistenceAccountData?.address!,
            withdrawMsg:withDrawMsg,
            pollInitialIBCAtomBalance:atomBalance,
            persistenceSigner:persistenceSigner!
        }))
    }

    return (
        <Button
            className={`${(name === WITHDRAW && inProgress) ? '!py-[0.8125rem]' : ''} 
            button w-full md:py-2 md:text-sm flex items-center justify-center`}
            type="primary"
            size="large"
            disabled={name === WITHDRAW && inProgress}
            content={
            (name === WITHDRAW && inProgress) ?
                <Spinner size={"medium"}/>
                :
                txFailed && stepNumber === 1 ? 'Retry' : 'Withdraw'
            }
            onClick={stakeHandler}
        />
    );
};


export default Submit;
