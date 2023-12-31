import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../../atoms/button";
import { RootState } from "../../../../store/reducers";
import { useWallet } from "../../../../context/WalletConnect/WalletConnect";
import { Spinner } from "../../../atoms/spinner";
import {
  LiquidUnStakeMsg,
  LiquidUnStakeMsgTypes,
  RedeemMsg
} from "../../../../helpers/protoMsg";
import {
  decimalize,
  truncateToFixedDecimalPlaces,
  unDecimalize
} from "../../../../helpers/utils";
import {
  COSMOS_CHAIN_ID,
  INSTANT,
  MIN_REDEEM,
  STK_FURY_MINIMAL_DENOM,
  UN_STAKE
} from "../../../../../AppConstants";
import { executeUnStakeTransactionSaga } from "../../../../store/reducers/transactions/unstake";
import { setTransactionProgress } from "../../../../store/reducers/transaction";
import { MakeIBCTransferMsg } from "../../../../helpers/transaction";
import {
  CHAIN_ID,
  IBCChainInfos,
  IBCConfiguration
} from "../../../../helpers/config";
import { useWindowSize } from "../../../../customHooks/useWindowSize";

const env: string = process.env.NEXT_PUBLIC_ENVIRONMENT!;

const Submit = () => {
  const dispatch = useDispatch();
  let ibcInfo = IBCChainInfos[env].find(
    (chain) => chain.counterpartyChainId === CHAIN_ID[env].furyChainID
  );
  const { stkFuryBalance, furyBalance } = useSelector(
    (state: RootState) => state.balances
  );
  const { amount, type } = useSelector((state: RootState) => state.unStake);
  const { inProgress, name } = useSelector(
    (state: RootState) => state.transaction
  );
  const { redeemFee, exchangeRate, maxRedeem } = useSelector(
    (state: RootState) => state.initialData
  );
  const { isMobile } = useWindowSize();
  const {
    connect,
    isWalletConnected,
    persistenceAccountData,
    persistenceSigner,
    persistenceChainData,
    furyAccountData,
    furyChainData
  } = useWallet();

  const stkFuryAmount = Number(amount) - Number(amount) * redeemFee;
  const furyAmount = Number(stkFuryAmount) / exchangeRate;

  let redeemAmount: number = 0;

  if (Number(amount) > MIN_REDEEM) {
    redeemAmount = truncateToFixedDecimalPlaces(furyAmount);
  } else {
    redeemAmount = Number(furyAmount.toFixed(18).match(/^\d+(?:\.\d{0,6})?/));
  }

  const stakeHandler = async () => {
    let messages: LiquidUnStakeMsgTypes[];
    let pollingBalance;
    dispatch(setTransactionProgress(UN_STAKE));
    if (type === INSTANT) {
      const withDrawMsg = await MakeIBCTransferMsg({
        channel: ibcInfo?.destinationChannelId,
        fromAddress: persistenceAccountData?.address,
        toAddress: furyAccountData?.address,
        amount: unDecimalize(redeemAmount),
        timeoutHeight: undefined,
        timeoutTimestamp: undefined,
        denom: ibcInfo?.coinDenom,
        sourceRPCUrl: persistenceChainData?.rpc,
        destinationRPCUrl: furyChainData?.rpc,
        port: IBCConfiguration.ibcDefaultPort
      });
      const redeemMsg = RedeemMsg(
        persistenceAccountData!.address,
        unDecimalize(amount),
        STK_FURY_MINIMAL_DENOM
      );
      pollingBalance = furyBalance;
      messages = [redeemMsg, withDrawMsg];
    } else {
      const liquidUnStakeMsg = LiquidUnStakeMsg(
        persistenceAccountData!.address,
        unDecimalize(amount),
        STK_FURY_MINIMAL_DENOM
      );
      pollingBalance = stkFuryBalance;
      messages = [liquidUnStakeMsg];
    }

    dispatch(
      executeUnStakeTransactionSaga({
        persistenceSigner: persistenceSigner!,
        msg: messages,
        address: persistenceAccountData!.address,
        persistenceChainInfo: persistenceChainData!,
        pollInitialBalance: pollingBalance,
        furyAddress: furyAccountData?.address!,
        furyChainInfo: furyChainData!
      })
    );
  };

  const enable =
    amount && Number(amount) > 0 && Number(amount) <= Number(stkFuryBalance);

  return isWalletConnected ? (
    <Button
      className={`${
        name === UN_STAKE && inProgress ? "!py-[0.8125rem]" : ""
      } button w-full 
         md:py-2 md:text-sm flex items-center justify-center`}
      type="primary"
      size="large"
      disabled={
        !enable ||
        (name === UN_STAKE && inProgress) ||
        (type === INSTANT && Number(amount) > Number(decimalize(maxRedeem))) ||
        (type === INSTANT && redeemAmount <= 0)
      }
      content={
        name === UN_STAKE && inProgress ? (
          <Spinner size={isMobile ? "small" : "medium"} />
        ) : Number(amount) > Number(stkFuryBalance) ? (
          "Insufficient balance"
        ) : type === INSTANT ? (
          Number(amount) > Number(decimalize(maxRedeem)) ? (
            "Not enough liquidity"
          ) : (
            "Redeem Instantly"
          )
        ) : (
          "Unstake"
        )
      }
      onClick={stakeHandler}
    />
  ) : (
    <Button
      className="button w-full md:py-2 md:text-sm"
      type="primary"
      size="large"
      disabled={true}
      content="Connect wallet"
    />
  );
};

export default Submit;
