import _ from "lodash";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import {
  createProtobufRpcClient,
  QueryClient,
  setupIbcExtension
} from "@cosmjs/stargate";
import { Decimal } from "@cosmjs/math";
import { Scope } from "@sentry/react";
import * as Sentry from "@sentry/react";
import { fetchAccountBalance } from "../pages/api/onChain";
import { ExternalChains, IBCConfiguration, PollingConfig } from "./config";
import {
  COSMOS_CHAIN_ID,
  IBC_DENOM,
  PERSISTENCE_CHAIN_ID,
  PERSISTENCE_INCENTIVES_ADDRESS,
  TEST_NET
} from "../../AppConstants";
import {
  QueryAllowListedValidatorsResponse,
  QueryClientImpl,
  QueryDelegationStateResponse
} from "./proto-codecs/codec/pstake/pstake/lscosmos/v1beta1/query";
import {
  QueryClientImpl as StakingQueryClient,
  QueryValidatorResponse
} from "cosmjs-types/cosmos/staking/v1beta1/query";
import { ChainInfo } from "@keplr-wallet/types";
const tendermint = require("cosmjs-types/ibc/lightclients/tendermint/v1/tendermint");

const env: string = process.env.NEXT_PUBLIC_ENVIRONMENT!;

const persistenceChainInfo = ExternalChains[env].find(
  (chain: ChainInfo) => chain.chainId === PERSISTENCE_CHAIN_ID
);

const cosmosChainInfo = ExternalChains[env].find(
  (chain: ChainInfo) => chain.chainId === COSMOS_CHAIN_ID
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
    return inputValue.substr(0, 6);
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
    substr.push("000000");
  } else {
    substr[1] = sixDigitsNumber(substr[1], decimalLength);
  }
  str = reverseString(substr[0]);
  const regex = `.{1,${size}}`;
  const arr = str.match(new RegExp(regex, "g"));
  return `${recursiveReverse(arr)}${substr[1] ? `.${substr[1]}` : ""}`;
};

export const stringTruncate = (str: string) => {
  if (str.length > 30) {
    return (
      str.substring(0, 7) + "..." + str.substring(str.length - 7, str.length)
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
  return Decimal.fromAtomics(valueString.toString(), decimals).toString();
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
      console.log(error.messae);
      console.log(
        "retrying in " + PollingConfig.scheduledTxHashQueryDelay + ": ",
        i,
        "th time"
      );
      await delay(PollingConfig.scheduledTxHashQueryDelay);
    }
  }

  // return;
  return JSON.stringify({
    txHash: address,
    height: 0,
    code: 111,
    rawLog: "failed all retries"
  });
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

export const printConsole = (message: string) => {
  if (process.env.NEXT_PUBLIC_ENVIRONMENT === TEST_NET) {
    console.log(message);
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
    const validators =
      allowListedValidators?.allowListedValidators?.allowListedValidators;
    const commissionRates: number[] = [];

    if (validators && validators?.length !== 0) {
      // keep the commission rates of validators in an array
      for (const addr of validators) {
        const validator: QueryValidatorResponse =
          await cosmosQueryService.Validator({
            validatorAddr: addr.validatorAddress
          });
        let commissionRate =
          parseFloat(
            decimalize(
              validator.validator!.commission
                ? validator.validator!.commission.commissionRates!.rate
                : 0,
              18
            )
          ) * 100;
        commissionRates.push(commissionRate);
      }
      /* Calculating the average commission rate of all the validators in the network. */
      commission =
        (weight * commissionRates.reduce((a, b) => a + b, 0)) /
        validators.length;
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

/**
 * It fetches the incentives for the delegator
 * @returns the incentives for the delegator.
 */
export const getIncentives = async () => {
  try {
    let incentives: number = 0;
    const rpcClient = await RpcClient(persistenceChainInfo?.rpc!);
    const pstakeQueryService = new QueryClientImpl(rpcClient);
    const delegationState: QueryDelegationStateResponse =
      await pstakeQueryService.DelegationState({});
    const hostAccountDelegations =
      delegationState?.delegationState?.hostAccountDelegations;

    let stakedAmount: number = 0;
    if (hostAccountDelegations) {
      for (const amount of hostAccountDelegations) {
        stakedAmount += parseInt(amount?.amount?.amount!, 10);
      }
    }
    const balance = await fetchAccountBalance(
      PERSISTENCE_INCENTIVES_ADDRESS,
      IBC_DENOM,
      persistenceChainInfo?.rpc!
    );
    if (balance) {
      incentives = (parseInt(balance, 10) * 365) / stakedAmount;
    }
    return incentives;
  } catch (e) {
    const customScope = new Scope();
    customScope.setLevel("fatal");
    customScope.setTags({
      "Error while fetching incentives": persistenceChainInfo?.rpc
    });
    genericErrorHandler(e, customScope);
    return 0;
  }
};
