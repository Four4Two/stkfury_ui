import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../../atoms/button";
import { RootState } from "../../../../store/reducers";
import { useWallet } from "../../../../context/WalletConnect/WalletConnect";
import { Spinner } from "../../../atoms/spinner";
import { unDecimalize } from "../../../../helpers/utils";
import {
  CHAIN_ID,
  IBCChainInfos,
  IBCConfiguration
} from "../../../../helpers/config";
import {
  COSMOS_CHAIN_ID,
  DEPOSIT,
  STAKE,
  WITHDRAW
} from "../../../../../AppConstants";
import { setTransactionProgress } from "../../../../store/reducers/transaction";
import { MakeIBCTransferMsg } from "../../../../helpers/transaction";
import {
  executeWithdrawTransactionSaga,
  setWithdrawAmount,
  setWithdrawTxnFailed,
  showWithdrawModal
} from "../../../../store/reducers/transactions/withdraw";
import { hideMobileSidebar } from "../../../../store/reducers/sidebar";

const env: string = process.env.NEXT_PUBLIC_ENVIRONMENT!;

const WithdrawButton = () => {
  const dispatch = useDispatch();
  let ibcInfo = IBCChainInfos[env].find(
    (chain) => chain.counterpartyChainId === CHAIN_ID[env].furyChainID
  );
  const { furyBalance, ibcFuryBalance } = useSelector(
    (state: RootState) => state.balances
  );
  const { inProgress, name } = useSelector(
    (state: RootState) => state.transaction
  );
  const {
    furyAccountData,
    furyChainData,
    persistenceAccountData,
    persistenceSigner,
    persistenceChainData
  } = useWallet();
  const { showModal } = useSelector((state: RootState) => state.withdraw);

  const withdrawHandler = async () => {
    dispatch(hideMobileSidebar());
    dispatch(setWithdrawAmount(ibcFuryBalance));
    dispatch(setWithdrawTxnFailed(false));
    dispatch(setTransactionProgress(WITHDRAW));
    const withDrawMsg = await MakeIBCTransferMsg({
      channel: ibcInfo?.destinationChannelId,
      fromAddress: persistenceAccountData?.address,
      toAddress: furyAccountData?.address,
      amount: unDecimalize(ibcFuryBalance),
      timeoutHeight: undefined,
      timeoutTimestamp: undefined,
      denom: ibcInfo?.coinDenom,
      sourceRPCUrl: persistenceChainData?.rpc,
      destinationRPCUrl: furyChainData?.rpc,
      port: IBCConfiguration.ibcDefaultPort
    });

    dispatch(
      executeWithdrawTransactionSaga({
        furyChainInfo: furyChainData!,
        persistenceChainInfo: persistenceChainData!,
        furyAddress: furyAccountData?.address!,
        persistenceAddress: persistenceAccountData?.address!,
        withdrawMsg: withDrawMsg,
        pollInitialIBCFuryBalance: furyBalance,
        persistenceSigner: persistenceSigner!
      })
    );
    dispatch(showWithdrawModal());
  };

  return (
    <Button
      size="small"
      type="secondary"
      content={
        name === WITHDRAW && inProgress && !showModal ? (
          <Spinner size={"small"} />
        ) : (
          "Withdraw"
        )
      }
      disabled={name === WITHDRAW && inProgress}
      className="w-full mt-6 md:text-xsm md:py-2 md:px-4"
      onClick={withdrawHandler}
    />
  );
};

export default WithdrawButton;
