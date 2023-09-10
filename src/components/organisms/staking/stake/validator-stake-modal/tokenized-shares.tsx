"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Submit from "./submit";
import { DelegatedValidator } from "../../../../../store/reducers/transactions/stake/types";
import Tooltip from "rc-tooltip";
import Image from "next/image";
import { useWallet } from "../../../../../context/WalletConnect/WalletConnect";
import { RootState } from "../../../../../store/reducers";
import {
  fetchDelegatedValidatorsSaga,
  fetchTokenizeSharesSaga,
  setValidatorModal
} from "../../../../../store/reducers/transactions/stake";
import Modal from "../../../../molecules/modal";
import {
  formatNumber,
  truncateToFixedDecimalPlaces
} from "../../../../../helpers/utils";
import { Icon } from "../../../../atoms/icon";
import { Spinner } from "../../../../atoms/spinner";
import {
  getTokenizedShares,
  getTokenizedSharesFromBalance
} from "../../../../../pages/api/onChain";
import { fetchTokenizeShares } from "../../../../../store/sagas/fetchingSagas";
import { ChainInfo } from "@keplr-wallet/types";

const TokenizedSharesModal = () => {
  const [inputState, setInputState] = useState<DelegatedValidator[]>([]);
  const [selectedInput, setSelectedInput] = useState<DelegatedValidator[]>([]);
  const [totalAmount, setTotalAmount] = useState<any>("0");
  const [selectedList, setSelectedList] = useState<DelegatedValidator[]>([]);

  const dispatch = useDispatch();
  const {
    cosmosAccountData,
    cosmosChainData,
    persistenceChainData,
    persistenceAccountData,
    isWalletConnected
  } = useWallet();

  const { cosmosBalances, persistenceBalances } = useSelector(
    (state: RootState) => state.balances
  );
  const { validators } = useSelector((state: RootState) => state.initialData);

  const {
    validatorModal,
    delegatedValidators,
    delegatedValidatorsLoader,
    tokenizedShares
  } = useSelector((state: RootState) => state.stake);

  const { exchangeRate } = useSelector((state: RootState) => state.initialData);

  useEffect(() => {
    if (isWalletConnected) {
      dispatch(
        fetchTokenizeSharesSaga({
          address: persistenceAccountData!.address,
          dstAddress: cosmosAccountData!.address,
          srcChain: persistenceChainData!,
          dstChain: cosmosChainData!,
          srcChainBalances: persistenceBalances,
          dstChainBalances: cosmosBalances
        })
      );
    }
  }, [isWalletConnected]);

  useEffect(() => {
    if (tokenizedShares) {
      console.log(tokenizedShares, "tokenizedShares-42");
      setInputState(
        tokenizedShares.sharesOnSourceChain.list.concat(
          tokenizedShares.sharesOnDestinationChain.list
        )
      );
      setTotalAmount(
        Number(tokenizedShares.sharesOnSourceChain.totalAmount) +
          Number(tokenizedShares.sharesOnDestinationChain.totalAmount)
      );
    }
  }, [tokenizedShares]);

  const handleClose = () => {
    dispatch(setValidatorModal(false));
    setInputState([]);
    setSelectedList([]);
    setTotalAmount("0");
  };

  return (
    <Modal
      show={validatorModal}
      onClose={handleClose}
      className="delegationModal"
      staticBackDrop={false}
      closeButton={false}
    >
      <div className={`px-10 py-10 md:p-7`}>
        <p className="text-light-emphasis text-xl font-semibold pb-4">
          Existing Tokenized Delegations
        </p>
        <div className="py-4 px-8 bg-black-800 w-full rounded-md mb-8">
          {!delegatedValidatorsLoader ? (
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-light-mid pb-2">Validators</p>
                <p className="text-sm text-light-full">
                  {inputState.length}
                  {inputState.length > 0 ? (
                    <Tooltip
                      placement="right"
                      overlay={inputState.map((item: any, index: number) => (
                        <div
                          key={index}
                          className={"flex items-center mx-2 my-1.5"}
                        >
                          <Image
                            src={item.identity}
                            alt={item.identity}
                            width={22}
                            height={22}
                            className="rounded-full mr-2"
                          />
                          <span className="text-xsm text-light-mi">
                            {" "}
                            {item.name}
                          </span>
                        </div>
                      ))}
                    >
                      <button className="icon-button px-1 align-middle mb-1">
                        <Icon viewClass="arrow-right" iconName="info" />
                      </button>
                    </Tooltip>
                  ) : null}
                </p>
              </div>
              <div>
                <p className="text-sm text-light-mid pb-2">Amount</p>
                <p className="text-sm text-light-full">
                  {truncateToFixedDecimalPlaces(Number(totalAmount))} ATOM
                </p>
              </div>
              <div>
                <p className="text-sm text-light-mid pb-2">You will get</p>
                <p className="text-sm text-light-full">
                  {truncateToFixedDecimalPlaces(
                    Number(totalAmount) * exchangeRate
                  )}{" "}
                  stkATOM
                </p>
              </div>
              <div>
                <p className="text-sm text-light-mid pb-2">Exchange Rate</p>
                <p className="text-sm text-light-full">
                  1 ATOM = {formatNumber(exchangeRate)} &nbsp; stkATOM
                </p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center">
              <Spinner size={"medium"} />
            </div>
          )}
        </div>

        <div className={"w-[340px] mx-auto"}>
          <Submit
            inputState={selectedInput}
            totalAmount={totalAmount}
            buttonText={"Liquid Stake"}
          />
        </div>
      </div>
    </Modal>
  );
};

export default TokenizedSharesModal;
