import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../../store/reducers";
import {
  resetTransaction,
  setTransactionProgress
} from "../../../../../../store/reducers/transaction";
import { useWallet } from "../../../../../../context/WalletConnect/WalletConnect";
import {
  executeDelegationStakeTransactionSaga,
  executeTokenizedShareStakeTransactionSaga,
  setDelegationsStakeAmount,
  setLiquidStakeTxnType,
  setStakeTxnFailed,
  setStakeTxnStepNumber,
  setTokenizedShareModal,
  setValidatorModal,
  showStakeModal
} from "../../../../../../store/reducers/transactions/stake";
import Button from "../../../../../atoms/button";
import { TokenizeSharesMsg } from "../../../../../../helpers/protoMsg";

const Submit = ({ inputState, totalAmount, buttonText, className }: any) => {
  const [error, setError] = useState<any>(false);
  const { tokenizedModal, delegatedValidatorsLoader, tokenizedShares } =
    useSelector((state: RootState) => state.stake);
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
      dispatch(setStakeTxnStepNumber(0));
      console.log(inputState, "inputState-123");
      dispatch(setStakeTxnFailed(false));
      dispatch(setLiquidStakeTxnType("tokenizedSharesStaking"));
      dispatch(setDelegationsStakeAmount(totalAmount));
      dispatch(setTransactionProgress("tokenizedSharesStaking"));
      dispatch(
        executeTokenizedShareStakeTransactionSaga({
          srcChainSigner: persistenceSigner!,
          dstChainSigner: cosmosSigner!,
          tokenList: tokenizedShares,
          account: persistenceAccountData?.address!,
          srcChainInfo: persistenceChainData!,
          pollInitialBalance: stkAtomBalance,
          dstAddress: cosmosAccountData!.address,
          dstChainInfo: cosmosChainData!
        })
      );
      dispatch(setTokenizedShareModal(false));
      dispatch(showStakeModal());
    } catch (e) {
      dispatch(setStakeTxnFailed(true));
      dispatch(resetTransaction());
    }
  };

  const validatorsHandler = () => {
    dispatch(setTokenizedShareModal(false));
    dispatch(setValidatorModal(true));
  };

  return (
    <div className="flex justify-between items-center">
      <Button
        className={`button w-full flex-1 !py-[8px] md:text-sm mr-4 ${className}`}
        type="secondary"
        size="medium"
        disabled={error || Number(totalAmount) <= 0}
        onClick={validatorsHandler}
        content={"View other delegations"}
      />
      <Button
        className={`button w-full flex-1 !py-[8px] md:text-sm ${className} !border-2 !border-[#c73238]`}
        type="primary"
        size="medium"
        disabled={error || Number(totalAmount) <= 0}
        onClick={stakeHandler}
        content={buttonText}
      />
    </div>
  );
};

export default Submit;
