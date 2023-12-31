import React, { useState } from "react";
import { ExchangeRateTypes } from "./types";
import { formatNumber } from "../../../helpers/utils";
import { Icon } from "../../atoms/icon";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/reducers";

const ExchangeRate = ({ type }: ExchangeRateTypes) => {
  const { exchangeRate } = useSelector((state: RootState) => state.initialData);
  const [reverseExchangeRate, setReverseExchangeRate] = useState(false);

  return (
    <>
      {type === "stake"
        ? reverseExchangeRate
          ? `1 stkFURY = ${formatNumber(1 / exchangeRate)} FURY`
          : `1 FURY = ${formatNumber(exchangeRate)} stkFURY`
        : reverseExchangeRate
        ? `1 FURY = ${formatNumber(exchangeRate)} stkFURY`
        : `1 stkFURY = ${formatNumber(1 / exchangeRate)} FURY`}

      <span
        className="flex ml-2 items-center cursor-pointer"
        onClick={() => {
          setReverseExchangeRate(!reverseExchangeRate);
        }}
      >
        <Icon iconName="switch" viewClass="search" />
      </span>
    </>
  );
};

export default ExchangeRate;
