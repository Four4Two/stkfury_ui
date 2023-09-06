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
  setValidatorModal,
  showStakeModal
} from "../../../../../store/reducers/transactions/stake";
import Button from "../../../../atoms/button";
import { TokenizeSharesMsg } from "../../../../../helpers/protoMsg";

const Submit = ({ inputState, totalAmount, buttonText, className }: any) => {
  const [error, setError] = useState<any>(false);

  useEffect(() => {
    if (inputState.length) {
      const amount = inputState.find((item: any) => {
        return Number(item.inputAmount) > Number(item?.amount);
      });
      if (amount) {
        setError(true);
      } else {
        setError(false);
      }
    }
  }, [inputState]);

  const dispatch = useDispatch();
  const { atomBalance, stkAtomBalance, ibcAtomBalance } = useSelector(
    (state: RootState) => state.balances
  );

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
      console.log(inputState, "inputState-123");
      dispatch(setStakeTxnFailed(false));
      let messages: any = [];
      inputState.forEach((item: any) => {
        messages.push(
          TokenizeSharesMsg(
            cosmosAccountData!.address,
            item.validatorAddress,
            cosmosAccountData!.address, // dstAccountData.address,
            (
              Number(item.inputAmount ? item.inputAmount : item?.amount) *
              1000000
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
          dstChainInfo: cosmosChainData!
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
