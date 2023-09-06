import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StakeOption } from "../../../../store/reducers/transactions/stake/types";
import { setValidatorModal } from "../../../../store/reducers/transactions/stake";
import { RootState } from "../../../../store/reducers";
import { Dropdown } from "../../../molecules/dropdown";
import { Icon } from "../../../atoms/icon";

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
  const { stakeOption } = useSelector((state: RootState) => state.stake);

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
    dispatch(setValidatorModal(true));
  };

  const dropCloseDownHandler = (value: boolean) => {
    setShow(value);
  };
  return (
    <div className="px-6 py-2 bg-[#151515] border rounded-md border-solid border-[#1C1C1C] flex justify-between items-center mb-4">
      <p className="text-sm text-light-high font-medium text-sm">
        Liquid Stake from
      </p>
      <div className="lex justify-between items-center">
        <Dropdown
          className="text-light-high"
          dropDownVariant="custom"
          closeDropdown={show}
          closeHandler={(value) => dropCloseDownHandler(value)}
          dropDownVariantBg="bg-black-700 text-[12px] text-light-high"
          dropdownLabel={
            <div className="flex items-center">
              <div
                className="rounded-full bg-[#C73238] flex items-center
              justify-center w-[28px] h-[28px] mr-2"
              >
                <Icon
                  iconName={getLogoPath(stakeOption)}
                  viewClass={"fill-[#FFFFFF] !w-[14px] !h-[12px]"}
                />
              </div>
              <span className="text-sm text-light-emphasis font-medium leading-normal md:text-xsm md:ml-2 capitalize">
                {stakeOption}
              </span>
            </div>
          }
          dropDownButtonClass="!py-1.5 bg-dark-700 "
          dropdownType={"click"}
          staticBackDrop={false}
          dropDownIcon={true}
          dropDownContentClass="!bg-[#282828] drop-shadow-md round-md !py-1 md:p-0"
        >
          <div
            className="px-4 py-1 flex items-center hover:cursor-pointer hover:bg-[#383838]
                   text-dark-high whitespace-nowrap"
            key={1}
            onClick={dropDownHandler}
          >
            <div className="flex items-center">
              <div
                className="rounded-full bg-[#212121] flex items-center
                     justify-center w-[28px] h-[28px] mr-2"
              >
                <Icon
                  iconName={"validators"}
                  viewClass={"fill-[#A6A6A6] !w-[14px] !h-[12px]"}
                />
              </div>
              <span className="text-sm text-light-emphasis font-medium leading-normal md:text-xsm md:ml-2 capitalize">
                Validator Delegation
              </span>
            </div>
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

export default StakeOptions;
