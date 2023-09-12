import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StakeOption } from "../../../../store/reducers/transactions/stake/types";
import {
  setTokenizedShareModal,
  setValidatorModal
} from "../../../../store/reducers/transactions/stake";
import { RootState } from "../../../../store/reducers";
import { Dropdown } from "../../../molecules/dropdown";
import { Icon } from "../../../atoms/icon";
import { MIN_STAKE } from "../../../../../AppConstants";

interface OptionsList {
  name: StakeOption;
  iconName: string;
  label: string;
}

export const getLogoPath = (network: StakeOption) => {
  let iconName = "";
  switch (network) {
    case "wallet":
      iconName = "wallet";
      break;
    case "validator":
      iconName = "validators";
      break;
    default:
      iconName = "wallet";
  }
  return iconName;
};

const StakeOptions = () => {
  const dispatch = useDispatch();
  const { stakeOption, tokenizedShares } = useSelector(
    (state: RootState) => state.stake
  );
  const [show, setShow] = useState<boolean>(false);

  const list: OptionsList[] = [
    {
      name: "wallet",
      label: "Wallet",
      iconName: "wallet"
    },
    {
      name: "validator",
      label: "Validator Delegation",
      iconName: "validators"
    }
  ];

  const dropDownHandler = async () => {
    const totalAmount =
      Number(tokenizedShares.sharesOnSourceChain.totalAmount) +
      Number(tokenizedShares.sharesOnDestinationChain.totalAmount);
    if (totalAmount > MIN_STAKE) {
      dispatch(setTokenizedShareModal(true));
    } else {
      dispatch(setValidatorModal(true));
    }
  };

  const dropCloseDownHandler = (value: boolean) => {
    setShow(value);
  };
  return (
    <Dropdown
      className="text-light-high w-full mb-2"
      dropDownVariant="custom"
      closeDropdown={show}
      closeHandler={(value) => dropCloseDownHandler(value)}
      dropDownVariantBg="bg-black-700 text-[12px] text-light-high"
      dropdownLabel={
        <div className="flex items-center">
          <div
            className="rounded-full bg-[#C73238] flex items-center
              justify-center w-[26px] h-[26px] mr-2"
          >
            <Icon
              iconName="wallet"
              viewClass={"fill-[#FFFFFF] !w-[14px] !h-[12px]"}
            />
          </div>
          <span className="text-base text-light-emphasis font-medium leading-normal md:text-xsm md:ml-2 capitalize">
            Liquid Staking using Wallet
          </span>
        </div>
      }
      dropDownButtonClass="text-[12px] text-light-high !py-2.5 bg-dark-700
         button md:text-sm w-full bg-[#151515] !px-6 !justify-between"
      dropdownType={"click"}
      staticBackDrop={false}
      dropDownIcon={true}
      dropDownContentClass="!bg-[#242424] drop-shadow-md round-md w-max py-1 md:p-0"
    >
      <>
        <div
          className="px-6 py-2 flex items-center pointer-events-none bg-[#191919]
                   text-dark-high whitespace-nowrap"
          onClick={dropDownHandler}
        >
          <div className={"flex-1"}>
            <div className="flex items-center">
              <div
                className="rounded-full bg-[#C73238] flex items-center
                     justify-center w-[26px] h-[26px] mr-2"
              >
                <Icon
                  iconName={"wallet"}
                  viewClass={"fill-[#FFFFFF] !w-[14px] !h-[12px]"}
                />
              </div>
              <span className="text-sm text-light-emphasis font-medium leading-normal md:text-xsm md:ml-2 capitalize">
                Liquid Staking using Wallet
              </span>
            </div>
          </div>
        </div>
        <div
          className="px-6 py-2 flex items-center hover:cursor-pointer
                   text-dark-high whitespace-nowrap"
          onClick={dropDownHandler}
        >
          <div className={"flex-1"}>
            <div className="flex items-center">
              <div
                className="rounded-full bg-[#C73238] flex items-center
                     justify-center w-[26px] h-[26px] mr-2"
              >
                <Icon
                  iconName={"validators"}
                  viewClass={"fill-[#FFFFFF] !w-[14px] !h-[12px]"}
                />
              </div>
              <span className="text-sm text-light-emphasis font-medium leading-normal md:text-xsm md:ml-2 capitalize">
                Liquid Stake your staked ATOM using LSM
              </span>
            </div>
          </div>
        </div>
      </>
    </Dropdown>
  );
};

export default StakeOptions;
