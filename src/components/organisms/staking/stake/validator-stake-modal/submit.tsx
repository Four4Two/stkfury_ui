import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../store/reducers";
import {
  resetTransaction,
  setTransactionProgress
} from "../../../../../store/reducers/transaction";
import { useWallet } from "../../../../../context/WalletConnect/WalletConnect";
import {
  executeDelegationStakeTransactionSaga,
  setDelegationsStakeAmount,
  setLiquidStakeTxnType,
  setStakeTxnFailed,
  setStakeTxnStepNumber,
  setValidatorModal,
  showStakeModal
} from "../../../../../store/reducers/transactions/stake";
import Button from "../../../../atoms/button";
import { TokenizeSharesMsg } from "../../../../../helpers/protoMsg";
import { MIN_STAKE } from "../../../../../../AppConstants";

const Submit = ({
  selectedList,
  inputState,
  totalAmount,
  buttonText,
  className
}: any) => {
  const [error, setError] = useState<any>(false);

  useEffect(() => {
    if (inputState.length) {
      const amountCheck = inputState.some((item: any) => {
        console.log(Number(item?.inputAmount), "inputState");
        if (Number(item?.inputAmount) > 0) {
          return (
            Number(item.inputAmount) > Number(item?.amount) ||
            Number(item.inputAmount) < MIN_STAKE
          );
        }
        return false;
      });
      if (amountCheck) {
        setError(true);
      } else {
        setError(false);
      }
    }
  }, [inputState]);

  const dispatch = useDispatch();
  const {
    atomBalance,
    stkAtomBalance,
    ibcAtomBalance,
    cosmosBalances,
    persistenceBalances
  } = useSelector((state: RootState) => state.balances);

  const {
    cosmosAccountData,
    cosmosChainData,
    persistenceChainData,
    persistenceAccountData,
    persistenceSigner,
    cosmosSigner
  } = useWallet();

  const stakeHandler = async () => {
    try {
      dispatch(setStakeTxnFailed(false));
      let messages: any = [];
      console.log(selectedList, "selectedList-44");
      selectedList.forEach((item: any) => {
        const response = inputState.find(
          (listItem: any) => listItem.validatorAddress === item.validatorAddress
        );
        console.log(response, "response-44");
        messages.push(
          TokenizeSharesMsg(
            cosmosAccountData!.address,
            response.validatorAddress,
            cosmosAccountData!.address, // dstAccountData.address,
            (
              Number(
                response.inputAmount ? response.inputAmount : response?.amount
              ) * 1000000
            ).toFixed(0),
            cosmosChainData!.stakeCurrency.coinMinimalDenom // cosmosAccountData.stakeCurrency.coinMinimalDenom
          )
        );
      });
      console.log(messages, "inputState-messages");
      dispatch(setLiquidStakeTxnType("delegationStaking"));
      dispatch(setDelegationsStakeAmount(totalAmount));
      dispatch(setTransactionProgress("delegationStaking"));
      dispatch(
        executeDelegationStakeTransactionSaga({
          srcChainSigner: persistenceSigner!,
          dstChainSigner: cosmosSigner!,
          msg: messages,
          account: persistenceAccountData?.address!,
          srcChainInfo: persistenceChainData!,
          pollInitialBalance: stkAtomBalance,
          dstAddress: cosmosAccountData!.address,
          dstChainInfo: cosmosChainData!,
          initialCosmosBalance: cosmosBalances,
          initialPersistenceBalance: persistenceBalances
        })
      );
      dispatch(setValidatorModal(false));
      dispatch(showStakeModal());
    } catch (e) {
      dispatch(setStakeTxnFailed(true));
      dispatch(resetTransaction());
    }
  };

  return (
    <Button
      className={`button w-full !py-[8px] md:text-sm ${className}`}
      type="primary"
      size="large"
      disabled={error || Number(totalAmount) <= 0}
      onClick={stakeHandler}
      content={buttonText}
    />
  );
};

export default Submit;