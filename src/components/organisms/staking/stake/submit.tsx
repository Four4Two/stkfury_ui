import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../../atoms/button";
import { RootState } from "../../../../store/reducers";
import { useWallet } from "../../../../context/WalletConnect/WalletConnect";
import { Spinner } from "../../../atoms/spinner";
import { LiquidStakeMsg } from "../../../../helpers/protoMsg";
import { unDecimalize } from "../../../../helpers/utils";
import {
  CHAIN_ID,
  IBCChainInfos,
  IBCConfiguration
} from "../../../../helpers/config";
import { DEPOSIT, MIN_STAKE_FEE, STAKE } from "../../../../../AppConstants";
import {
  setStakeTxnFailed,
  showStakeModal
} from "../../../../store/reducers/transactions/stake";
import {
  resetTransaction,
  setTransactionProgress
} from "../../../../store/reducers/transaction";
import { MakeIBCTransferMsg } from "../../../../helpers/transaction";
import { executeDepositTransactionSaga } from "../../../../store/reducers/transactions/deposit";
import { useWindowSize } from "../../../../customHooks/useWindowSize";

const env: string = process.env.NEXT_PUBLIC_ENVIRONMENT!;

const Submit = () => {
  const dispatch = useDispatch();
  const { isMobile } = useWindowSize();
  const { minDeposit } = useSelector((state: RootState) => state.initialData);
  let ibcInfo = IBCChainInfos[env].find(
    (chain) => chain.counterpartyChainId === CHAIN_ID[env].cosmosChainID
  );
  const { atomBalance, stkAtomBalance, ibcAtomBalance } = useSelector(
    (state: RootState) => state.balances
  );
  const { amount, showModal } = useSelector((state: RootState) => state.stake);
  const { inProgress, name } = useSelector(
    (state: RootState) => state.transaction
  );
  const {
    cosmosAccountData,
    cosmosChainData,
    cosmosSigner,
    persistenceAccountData,
    persistenceSigner,
    persistenceChainData,
    isWalletConnected,
    connect
  } = useWallet();

  const diff = Number((atomBalance - Number(amount)).toFixed(6));

  const stakeAmount =
    diff < MIN_STAKE_FEE
      ? (Number(amount) - Number((MIN_STAKE_FEE - diff).toFixed(6))).toFixed(6)
      : amount;

  const stakeHandler = async () => {
    try {
      dispatch(setStakeTxnFailed(false));
      dispatch(setTransactionProgress(DEPOSIT));
      const depositMsg = await MakeIBCTransferMsg({
        channel: ibcInfo?.sourceChannelId,
        fromAddress: cosmosAccountData?.address,
        toAddress: persistenceAccountData?.address,
        amount: unDecimalize(stakeAmount),
        timeoutHeight: undefined,
        timeoutTimestamp: undefined,
        denom: cosmosChainData?.stakeCurrency.coinMinimalDenom,
        sourceRPCUrl: cosmosChainData?.rpc,
        destinationRPCUrl: persistenceChainData?.rpc,
        port: IBCConfiguration.ibcDefaultPort
      });

      const stakeMsg = LiquidStakeMsg(
        persistenceAccountData!.address,
        unDecimalize(stakeAmount),
        ibcInfo!.coinDenom
      );

      dispatch(
        executeDepositTransactionSaga({
          cosmosSigner: cosmosSigner!,
          cosmosChainInfo: cosmosChainData!,
          persistenceChainInfo: persistenceChainData!,
          cosmosAddress: cosmosAccountData!.address,
          persistenceAddress: persistenceAccountData!.address,
          depositMsg: depositMsg,
          stakeMsg: stakeMsg,
          pollInitialDepositBalance: ibcAtomBalance,
          pollInitialStakeBalance: stkAtomBalance,
          persistenceSigner: persistenceSigner!
        })
      );
      dispatch(showStakeModal());
    } catch (e) {
      dispatch(setStakeTxnFailed(true));
      dispatch(resetTransaction());
    }
  };

  const enable =
    amount &&
    Number(amount) > 0 &&
    Number(amount) <= Number(atomBalance) &&
    MIN_STAKE_FEE + minDeposit <= Number(amount);

  return isWalletConnected ? (
    <Button
      className={`${
        (name === STAKE || name === DEPOSIT) && inProgress
          ? "!py-[0.8125rem]"
          : ""
      }
         button w-full md:py-2 md:text-sm flex items-center justify-center`}
      type="primary"
      size="large"
      disabled={!enable || ((name === STAKE || name === DEPOSIT) && inProgress)}
      content={
        (name === STAKE || name === DEPOSIT) && inProgress && !showModal ? (
          <Spinner size={isMobile ? "small" : "medium"} />
        ) : minDeposit <= Number(amount) ? (
          "Liquid Stake"
        ) : (
          "Liquid Stake"
        )
      }
      onClick={stakeHandler}
    />
  ) : (
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
