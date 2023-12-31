"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Submit from "./submit";
import { DelegatedValidator } from "../../../../../store/reducers/transactions/stake/types";
import Tooltip from "rc-tooltip";
import Image from "next/image";
import { useWallet } from "../../../../../context/WalletConnect/WalletConnect";
import { RootState } from "../../../../../store/reducers";
import {
  fetchDelegatedValidatorsSaga,
  setValidatorModal
} from "../../../../../store/reducers/transactions/stake";
import Modal from "../../../../molecules/modal";
import {
  formatNumber,
  truncateToFixedDecimalPlaces
} from "../../../../../helpers/utils";
import { Icon } from "../../../../atoms/icon";
import { Spinner } from "../../../../atoms/spinner";
import { MIN_STAKE } from "../../../../../../AppConstants";
import { Switch } from "../../../../atoms/switch";

const ValidatorStakeModal = () => {
  const [inputState, setInputState] = useState<DelegatedValidator[]>([]); // initial validator list
  const [selectedInput, setSelectedInput] = useState<DelegatedValidator[]>([]);
  const [totalAmount, setTotalAmount] = useState<any>("0");
  const [selectedList, setSelectedList] = useState<DelegatedValidator[]>([]);
  const [switchValue, setSwitchValue] = useState(false);

  const dispatch = useDispatch();
  const {
    furyAccountData,
    furyChainData,
    persistenceChainData,
    persistenceAccountData,
    isWalletConnected
  } = useWallet();

  const { furyPrice } = useSelector((state: RootState) => state.liveData);
  const { validators } = useSelector((state: RootState) => state.initialData);

  const { validatorModal, delegatedValidators, delegatedValidatorsLoader } =
    useSelector((state: RootState) => state.stake);

  const { exchangeRate } = useSelector((state: RootState) => state.initialData);

  useEffect(() => {
    if (isWalletConnected) {
      dispatch(
        fetchDelegatedValidatorsSaga({
          address: furyAccountData?.address!,
          rpc: furyChainData?.rpc!,
          validators: validators
        })
      );
    }
  }, [furyAccountData, isWalletConnected]);

  useEffect(() => {
    if (delegatedValidators) {
      setInputState(delegatedValidators.eligible);
    }
  }, [delegatedValidators]);

  const handleClose = () => {
    dispatch(setValidatorModal(false));
    setInputState([]);
    setSelectedList([]);
    setTotalAmount("0");
  };

  const onChangeHandler = (evt: any) => {
    let rex = /^\d{0,10}(\.\d{0,10})?$/;
    if (rex.test(evt.target.value)) {
      inputHandler(evt.target.name, evt.target.value);
    } else {
      return false;
    }
  };

  const inputHandler = (name: string, inputAmount: string) => {
    let selectedListArray: DelegatedValidator[] = [];
    const newList: DelegatedValidator[] = inputState.map(
      (item: DelegatedValidator) => {
        let itemCopy = { ...item };
        if (item.name === name) {
          itemCopy.inputAmount = inputAmount;
          const response = selectedList.some(
            (selectedItem: DelegatedValidator) => {
              return selectedItem.name === item.name;
            }
          );
          if (Number(inputAmount) > 0) {
            if (!response) {
              setSelectedList([...selectedList, item]);
            }
          } else {
            if (response) {
              setSelectedList(
                selectedList.filter(
                  (selectedItem) => selectedItem.name !== item.name
                )
              );
            }
          }
        }
        selectedListArray.push(itemCopy);
        return itemCopy;
      }
    );
    const amount = newList.reduce((accumulator, object) => {
      return accumulator + Number(object?.inputAmount);
    }, 0);
    setSelectedInput(selectedListArray);
    setInputState(newList);
    setTotalAmount(amount);
  };

  const switchHandler = (evt: ChangeEvent<HTMLInputElement>) => {
    if (switchValue) {
      setInputState(delegatedValidators.eligible);
    } else {
      setInputState(delegatedValidators.nonEligible);
    }
    setSwitchValue(!switchValue);
    console.log("switchHandler-1switchHandler", evt);
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
        <p className="text-light-emphasis text-xl font-semibold pb-2">
          Liquid Stake your staked FURY using LSM
        </p>
        <div className="flex items-center mb-6 justify-between">
          <p className="text-sm text-light-mid pr-2">
            Select the validator(s) and enter the amount of staked FURY you wish
            to liquid stake.&nbsp;
            <a
              href="https://blog.pstake.finance/2023/09/12/cosmos-lsm-fury-liquid-staking-made-simpler-with-pstake/"
              target="_blank"
              rel="noreferrer"
              className="text-[#3E73F0] underline"
            >
              Learn more here.
            </a>
          </p>
        </div>
        <div className="pb-4">
          <div className="flex justify-between items-center mb-3">
            <p className={"text-light-high text-sm"}>List of validators</p>
            <Switch
              size={"sm"}
              checked={switchValue}
              labelText={"Show not-eligible validators"}
              onChange={switchHandler}
            />
          </div>

          <div className="max-h-[250px] overflow-auto">
            <table className="w-full">
              <thead className="">
                <tr>
                  <th
                    className="pl-8 py-3 backdrop-blur text-sm text-left text-light-mid font-normal
                  sticky top-0 !bg-[#252525] h-[48px]"
                  >
                    Validator
                  </th>
                  <th
                    className="px-4 py-3 text-light-mid text-sm backdrop-blur font-normal
                   text-left sticky top-0 !bg-[#252525] h-[48px]"
                  >
                    Staked FURY
                  </th>
                  <th
                    className="px-4 py-3 text-light-mid text-sm  backdrop-blur font-normal
                   text-left sticky top-0 !bg-[#252525] h-[48px]"
                  >
                    Status
                  </th>
                  <th
                    className="text-left py-3 pl-4 pr-8 backdrop-blur text-sm  text-light-mid
                  font-normal sticky top-0 !bg-[#252525] h-[48px] !z-[999]"
                  >
                    Liquid Stake
                  </th>
                </tr>
              </thead>
              <tbody className="bg-black-800">
                {!delegatedValidatorsLoader ? (
                  inputState.length > 0 ? (
                    inputState.map(
                      (item: DelegatedValidator, index: number) => (
                        <tr key={index} className="py-2">
                          <td className="pl-8 py-3 text-left text-light-mid text-sm">
                            <div className={"flex items-center"}>
                              <div className="mr-4">
                                {Number(item.inputAmount) > 0 ? (
                                  <div
                                    onClick={() => inputHandler(item.name, "")}
                                    className={"cursor-pointer"}
                                  >
                                    <Icon
                                      iconName="checkbox"
                                      viewClass="!w-[18px] !h-[18px] fill-[#C73238]"
                                    />
                                  </div>
                                ) : item.status === "active" ? (
                                  <span
                                    className="w-[18px] h-[18px] border-2 rounded-sm
                            border-solid border-[#C73238] block cursor-pointer"
                                    onClick={() =>
                                      inputHandler(item.name, item.amount)
                                    }
                                  />
                                ) : (
                                  <span
                                    className="w-[18px] h-[18px] border-2 rounded-sm
                            border-solid border-[#C73238] block text-[#C73238] flex items-center justify-center font-bold opacity-20"
                                  >
                                    -
                                  </span>
                                )}
                              </div>
                              <Image
                                src={item.identity}
                                alt={item.identity}
                                width={28}
                                height={28}
                                className="rounded-full mr-2"
                              />
                              {item.name}
                            </div>
                          </td>
                          <td className={"px-4 py-3 text-left text-light-mid"}>
                            <p className={""}>
                              <span
                                className={
                                  "text-light-full font-medium text-sm"
                                }
                              >
                                {" "}
                                {truncateToFixedDecimalPlaces(
                                  Number(item.amount)
                                )}
                              </span>
                              <span
                                className={
                                  "block text-light-low font-medium text-sm"
                                }
                              >{`$${(
                                furyPrice * Number(item.amount)
                              ).toLocaleString()}`}</span>
                            </p>
                          </td>
                          <td className="px-4 py-3 text-left text-light-mid">
                            <Tooltip
                              placement="top"
                              overlay={
                                <p
                                  className={`${
                                    item.status === "active"
                                      ? "text-[#47C28B]"
                                      : "text-light-mid"
                                  }  text-sm font-semibold`}
                                >
                                  {item.status === "active" ? (
                                    "ELIGIBLE"
                                  ) : (
                                    <span className="uppercase">
                                      {item.status === "inactive"
                                        ? "Jailed"
                                        : item.status === "not-bonded"
                                        ? "Validator bond not available"
                                        : "Not Eligible"}
                                    </span>
                                  )}
                                </p>
                              }
                            >
                              <button className="icon-button px-1 align-middle mb-1">
                                <Icon
                                  iconName={
                                    item.status === "active"
                                      ? "success-right"
                                      : "crossed"
                                  }
                                  viewClass="!w-[16px] !h-[16px]"
                                />
                              </button>
                            </Tooltip>
                          </td>
                          <td className="py-3 pl-4 pr-8 text-left">
                            <div
                              className={`relative w-[164px] z-10 ${
                                item.status === "active"
                                  ? ""
                                  : "pointer-events-none opacity-20"
                              }`}
                            >
                              <input
                                placeholder={"Enter Amount"}
                                type="number"
                                onWheel={(e: any) => e.target.blur()}
                                className={`w-full border border-solid p-2 text-[12px] font-medium rounded-md outline-none bg-black-400 text-light-mid  ${
                                  Number(item.inputAmount) > Number(item.amount)
                                    ? "border-primary"
                                    : "border-[#282828]"
                                }`}
                                name={item.name}
                                id={item.name}
                                value={item.inputAmount}
                                onChange={onChangeHandler}
                              />
                              {Number(item.inputAmount) <
                              Number(item.amount) ? (
                                <span
                                  className="text-light-high ml-2 text-[10px] font-bold uppercase
                            cursor-pointer absolute right-[10px] top-[10px]"
                                  onClick={() =>
                                    inputHandler(item.name, item.amount)
                                  }
                                >
                                  Max
                                </span>
                              ) : (
                                ""
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td className="text-center p-4" colSpan={4}>
                        No delegations found
                      </td>
                    </tr>
                  )
                ) : (
                  <tr>
                    <td className="text-center p-4" colSpan={4}>
                      <Spinner size={"medium"} />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="py-4 px-8 bg-black-800 w-full rounded-md mb-8">
          <div className="flex justify-between items-center flex-wrap">
            <div className={"flex-[15%]"}>
              <p className="text-sm text-light-mid pb-2">Validators</p>
              <p className="text-sm text-light-full">
                {selectedList.length}
                {selectedList.length > 0 ? (
                  <Tooltip
                    placement="bottom"
                    overlay={selectedList.map(
                      (item: DelegatedValidator, index: number) => (
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
                    <button className="icon-button px-1 align-middle -mt-1">
                      <Icon viewClass="arrow-right" iconName="info" />
                    </button>
                  </Tooltip>
                ) : null}
              </p>
            </div>
            <div className={"flex-[20%]"}>
              <p className="text-sm text-light-mid pb-2">Total Amount</p>
              <p className="text-sm text-light-full">
                {truncateToFixedDecimalPlaces(Number(totalAmount))} FURY
              </p>
            </div>
            <div className={"flex-[30%]"}>
              <p className="text-sm text-light-mid pb-2">You Will Get</p>
              <p className="text-sm text-light-full">
                {truncateToFixedDecimalPlaces(
                  Number(totalAmount) * exchangeRate
                )}{" "}
                stkFURY
              </p>
            </div>
            <div className={"flex-[30%]"}>
              <p className="text-sm text-light-mid pb-2">Exchange Rate</p>
              <p className="text-sm text-light-full">
                1 FURY = {formatNumber(exchangeRate)} &nbsp; stkFURY
              </p>
            </div>
          </div>
        </div>

        <div className={"w-[340px] mx-auto"}>
          <Submit
            selectedList={selectedList}
            inputState={selectedInput}
            totalAmount={totalAmount}
            buttonText={"Liquid Stake"}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ValidatorStakeModal;
