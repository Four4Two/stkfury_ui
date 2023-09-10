"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Submit from "./submit";
import { DelegatedValidator } from "../../../../../../store/reducers/transactions/stake/types";
import Tooltip from "rc-tooltip";
import Image from "next/image";
import { useWallet } from "../../../../../../context/WalletConnect/WalletConnect";
import { RootState } from "../../../../../../store/reducers";
import {
  fetchTokenizeSharesSaga,
  setTokenizedShareModal
} from "../../../../../../store/reducers/transactions/stake";
import Modal from "../../../../../molecules/modal";
import {
  formatNumber,
  truncateToFixedDecimalPlaces
} from "../../../../../../helpers/utils";
import { Icon } from "../../../../../atoms/icon";
import { Spinner } from "../../../../../atoms/spinner";
import { MIN_STAKE } from "../../../../../../../AppConstants";

const TokenizedSharesModal = () => {
  const [inputState, setInputState] = useState<DelegatedValidator[]>([]);
  const [totalAmount, setTotalAmount] = useState<any>("0");
  const [validatorList, setValidatorList] = useState<any[]>([]);

  const dispatch = useDispatch();

  const { tokenizedModal, delegatedValidatorsLoader, tokenizedShares } =
    useSelector((state: RootState) => state.stake);

  const { exchangeRate } = useSelector((state: RootState) => state.initialData);

  useEffect(() => {
    if (tokenizedShares) {
      console.log(tokenizedShares, "tokenizedShares-42");
      const list = tokenizedShares.sharesOnSourceChain.list.concat(
        tokenizedShares.sharesOnDestinationChain.list
      );
      setInputState(list);
      setTotalAmount(
        Number(tokenizedShares.sharesOnSourceChain.totalAmount) +
          Number(tokenizedShares.sharesOnDestinationChain.totalAmount)
      );
      console.log(list, "list-42");
      if (list.length > 0) {
        let vList: any[] = [];
        list.map((item: any) => {
          console.log(vList, "vList-42");
          const validatorResponse = vList.find(
            (validator) => validator.validatorAddress === item.validatorAddress
          );
          console.log(validatorResponse, "validatorResponse-42");
          if (validatorResponse === undefined) {
            vList.push({
              name: item.name,
              validatorAddress: item.validatorAddress,
              identity: item.identity
            });
          }
        });
        setValidatorList(vList);
        // dispatch(setTokenizedShareModal(false));
        // dispatch(setValidatorModal(true));
      }
    }
  }, [tokenizedShares]);

  const handleClose = () => {
    dispatch(setTokenizedShareModal(false));
    setInputState([]);
    setTotalAmount("0");
  };

  return (
    <Modal
      show={tokenizedModal}
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
            totalAmount > MIN_STAKE ? (
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-light-mid pb-2">Validators</p>
                  <p className="text-sm text-light-full">
                    {validatorList.length}
                    {validatorList.length > 0 ? (
                      <Tooltip
                        placement="right"
                        overlay={validatorList.map(
                          (item: any, index: number) => (
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
                          )
                        )}
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
              <p>
                Tokenized delegations not found. Click on View other delegation
                button to liquid stake from delegations
              </p>
            )
          ) : (
            <div className="flex justify-center items-center">
              <Spinner size={"medium"} />
            </div>
          )}
        </div>

        <div className={"w-full mx-auto"}>
          <Submit
            inputState={inputState}
            totalAmount={totalAmount}
            buttonText={"Liquid Stake"}
          />
        </div>
      </div>
    </Modal>
  );
};

export default TokenizedSharesModal;
