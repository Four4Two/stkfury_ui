import _ from "lodash";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { createProtobufRpcClient, QueryClient } from "@cosmjs/stargate";
import { Decimal } from "@cosmjs/math";
import { Scope } from "@sentry/react";
import * as Sentry from "@sentry/react";
import { fetchAccountBalance } from "../pages/api/onChain";
import { CHAIN_ID, ExternalChains, PollingConfig } from "./config";
import { TEST_NET } from "../../AppConstants";
import {
  QueryAllowListedValidatorsResponse,
  QueryClientImpl
} from "./proto-codecs/codec/pstake/pstake/lscosmos/v1beta1/query";
import {
  QueryClientImpl as StakingQueryClient,
  QueryValidatorResponse,
  QueryValidatorsResponse
} from "cosmjs-types/cosmos/staking/v1beta1/query";
import { ChainInfo } from "@keplr-wallet/types";
import { AllowListedValidator } from "./proto-codecs/codec/pstake/pstake/lscosmos/v1beta1/pstake/lscosmos/v1beta1/lscosmos";
import Long from "long";
const tendermint = require("cosmjs-types/ibc/lightclients/tendermint/v1/tendermint");

const env: string = process.env.NEXT_PUBLIC_ENVIRONMENT!;

const persistenceChainInfo = ExternalChains[env].find(
  (chain: ChainInfo) => chain.chainId === CHAIN_ID[env].persistenceChainID
);

const cosmosChainInfo = ExternalChains[env].find(
  (chain: ChainInfo) => chain.chainId === CHAIN_ID[env].cosmosChainID
);

export async function RpcClient(rpc: string) {
  const tendermintClient = await Tendermint34Client.connect(rpc);
  const queryClient = new QueryClient(tendermintClient);
  return createProtobufRpcClient(queryClient);
}

export const removeCommas = (str: any) =>
  _.replace(str, new RegExp(",", "g"), "");

const reverseString = (str: any) =>
  removeCommas(_.toString(_.reverse(_.toArray(str))));

const recursiveReverse = (input: any): string => {
  if (_.isArray(input))
    return _.toString(_.reverse(_.map(input, (v) => recursiveReverse(v))));
  if (_.isString()) return reverseString(input);
  return reverseString(`${input}`);
};

export const sixDigitsNumber = (value: string, length = 6) => {
  let inputValue = value.toString();
  if (inputValue.length >= length) {
    return inputValue.substring(0, length);
  } else {
    const stringLength = length - inputValue.length;
    let newString = inputValue;
    for (let i = 0; i < stringLength; i++) {
      newString += "0";
    }
    return newString;
  }
};

export const formatNumber = (v = 0, size = 3, decimalLength = 6) => {
  let str = `${v}`;
  if (!str) return "NaN";
  let substr = str.split(".");
  if (substr[1] === undefined) {
    let newString = "0";
    for (let i = 1; i < decimalLength; i++) {
      newString += "0";
    }
    substr.push(newString);
  } else {
    substr[1] = sixDigitsNumber(substr[1], decimalLength);
  }
  str = reverseString(substr[0]);
  const regex = `.{1,${size}}`;
  const arr = str.match(new RegExp(regex, "g"));
  return `${recursiveReverse(arr)}${substr[1] ? `.${substr[1]}` : ""}`;
};

export const stringTruncate = (str: string, length = 7) => {
  if (str.length > 30) {
    return (
      str.substring(0, length) +
      "..." +
      str.substring(str.length - length, str.length)
    );
  }
  return str;
};

export const truncateToFixedDecimalPlaces = (
  num: number,
  decimalPlaces = 6
) => {
  const regexString = "^-?\\d+(?:\\.\\d{0,dp})?";
  const regexToMatch = regexString.replace("dp", `${decimalPlaces}`);
  const regex = new RegExp(regexToMatch);
  const matched = num.toString().match(regex);
  if (matched) {
    return parseFloat(matched[0]);
  }
  return 0;
};

export const emptyFunc = () => ({});

export const decimalize = (valueString: string | number, decimals = 6) => {
  let truncate: number;
  if (typeof valueString === "string") {
    truncate = Number(valueString);
  } else {
    truncate = valueString;
  }
  return Decimal.fromAtomics(
    Math.trunc(truncate!).toString(),
    decimals
  ).toString();
};

export const unDecimalize = (valueString: string | number, decimals = 6) => {
  return Decimal.fromUserInput(valueString.toString(), decimals).atomics;
};

export const genericErrorHandler = (e: any, scope = new Scope()) => {
  console.error(e);
  Sentry.captureException(e, scope);
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function pollAccountBalance(
  address: string,
  denom: string,
  rpc: string,
  availableAmount: string
) {
  let initialBalance;
  if (availableAmount) {
    initialBalance = availableAmount;
  } else {
    initialBalance = await fetchAccountBalance(address, denom, rpc);
  }
  printConsole(initialBalance + "initialBalance");
  await delay(PollingConfig.initialTxHashQueryDelay);
  for (let i = 0; i < PollingConfig.numberOfRetries; i++) {
    try {
      const fetchResult = await fetchAccountBalance(address, denom, rpc);
      if (fetchResult !== "0" && decimalize(fetchResult) !== initialBalance) {
        return fetchResult;
      } else {
        throw Error("Balance unchanged");
      }
    } catch (error: any) {
      printConsole(
        "polling balance in " +
          PollingConfig.scheduledTxHashQueryDelay +
          ": " +
          i +
          "th time"
      );
      await delay(PollingConfig.scheduledTxHashQueryDelay);
    }
  }
  throw new Error("failed all retries");
}

export const decodeTendermintClientStateAny = (clientState: any) => {
  if (
    (clientState === null || clientState === void 0
      ? void 0
      : clientState.typeUrl) !== "/ibc.lightclients.tendermint.v1.ClientState"
  ) {
    throw new Error(
      `Unexpected client state type: ${
        clientState === null || clientState === void 0
          ? void 0
          : clientState.typeUrl
      }`
    );
  }
  return tendermint.ClientState.decode(clientState.value);
};

// copied from node_modules/@cosmjs/stargate/build/queries/ibc.js
export const decodeTendermintConsensusStateAny = (consensusState: any) => {
  if (
    (consensusState === null || consensusState === void 0
      ? void 0
      : consensusState.typeUrl) !==
    "/ibc.lightclients.tendermint.v1.ConsensusState"
  ) {
    throw new Error(
      `Unexpected client state type: ${
        consensusState === null || consensusState === void 0
          ? void 0
          : consensusState.typeUrl
      }`
    );
  }
  return tendermint.ConsensusState.decode(consensusState.value);
};

export const printConsole = (message: any, helpText = "") => {
  if (process.env.NEXT_PUBLIC_ENVIRONMENT === TEST_NET) {
    console.log(message, helpText);
  }
};

/**
 * It fetches the commission rates of all the validators in the network and returns the average
 * commission rate
 * @returns The commission rate of the validators.
 */
export const getCommission = async () => {
  try {
    const weight: number = 1;
    let commission: number = 0;
    const rpcClient = await RpcClient(persistenceChainInfo?.rpc!);
    const pstakeQueryService = new QueryClientImpl(rpcClient);
    const allowListedValidators: QueryAllowListedValidatorsResponse =
      await pstakeQueryService.AllowListedValidators({});
    const cosmosRpcClient = await RpcClient(cosmosChainInfo?.rpc!);
    const cosmosQueryService = new StakingQueryClient(cosmosRpcClient);
    const validators: AllowListedValidator[] | undefined =
      allowListedValidators?.allowListedValidators?.allowListedValidators;
    const commissionRates: number[] = [];

    let key: any = new Uint8Array();
    let cosmosValidators = [];

    do {
      const validatorCommission: QueryValidatorsResponse =
        await cosmosQueryService.Validators({
          status: "BOND_STATUS_BONDED",
          pagination: {
            key: key,
            offset: Long.fromNumber(0, true),
            limit: Long.fromNumber(0, true),
            countTotal: true,
            reverse: false
          }
        });
      key = validatorCommission?.pagination?.nextKey;
      cosmosValidators.push(...validatorCommission.validators);
    } while (key.length !== 0);

    if (cosmosValidators?.length !== 0) {
      for (const validator of cosmosValidators) {
        const listedValidator: any = validators?.find(
          (item: any) => item?.validatorAddress === validator.operatorAddress
        );
        if (listedValidator) {
          let commissionRate =
            parseFloat(
              decimalize(
                validator!.commission
                  ? validator!.commission.commissionRates!.rate
                  : 0,
                18
              )
            ) * 100;
          commissionRates.push(commissionRate);
        }
      }
      commission =
        (weight * commissionRates.reduce((a, b) => a + b, 0)) /
        validators!.length;
    } else {
      commission = 0;
    }
    return commission;
  } catch (e) {
    const customScope = new Scope();
    customScope.setLevel("fatal");
    customScope.setTags({
      "Error while fetching commission": persistenceChainInfo?.rpc
    });
    genericErrorHandler(e, customScope);
    return 0;
  }
};
