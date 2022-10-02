import _ from "lodash";
import {Tendermint34Client} from "@cosmjs/tendermint-rpc";
import { createProtobufRpcClient, QueryClient, setupIbcExtension } from "@cosmjs/stargate";
import {Decimal} from "@cosmjs/math";
import {Scope} from "@sentry/react";
import * as Sentry from "@sentry/react"
import { fetchAccountBalance } from "../pages/api/onChain";
import { IBCConfiguration, PollingConfig } from "./config";
import { TEST_NET } from "../../AppConstants";
const tendermint = require("cosmjs-types/ibc/lightclients/tendermint/v1/tendermint");

export async function RpcClient(rpc: string) {
    const tendermintClient = await Tendermint34Client.connect(rpc);
    const queryClient = new QueryClient(tendermintClient);
    return createProtobufRpcClient(queryClient);
}

export const removeCommas = (str:any) => _.replace(str, new RegExp(",", "g"), "");

const reverseString = (str:any) => removeCommas(_.toString(_.reverse(_.toArray(str))));

const recursiveReverse = (input:any):string => {
    if (_.isArray(input)) return _.toString(_.reverse(_.map(input, v => recursiveReverse(v))));
    if (_.isString()) return reverseString(input);
    return reverseString(`${input}`);
};

export const sixDigitsNumber = (value:string, length = 6) => {
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
        substr.push('000000');
    } else {
        substr[1] = sixDigitsNumber(substr[1], decimalLength);
    }
    str = reverseString(substr[0]);
    const regex = `.{1,${size}}`;
    const arr = str.match(new RegExp(regex, "g"));
    return `${recursiveReverse(arr)}${substr[1] ? `.${substr[1]}` : ""}`;
};

export const stringTruncate = (str:string) => {
    if (str.length > 30) {
        return str.substring(0, 7) + '...' + str.substring(str.length - 7, str.length);
    }
    return str;
};

export const truncateToFixedDecimalPlaces = (num:number, decimalPlaces = 6) => {
    const regexString = "^-?\\d+(?:\\.\\d{0,dp})?";
    const regexToMatch = regexString.replace("dp", `${decimalPlaces}`)
    const regex = new RegExp(regexToMatch);
    const matched = num.toString().match(regex)
    if (matched) {
        return parseFloat(matched[0])
    }
    return 0
}

export const emptyFunc = () => ({});

export const decimalize = (valueString:string | number, decimals = 6) => {
    return Decimal.fromAtomics(valueString.toString(), decimals).toString();
};

export const unDecimalize = (valueString:string | number, decimals = 6) => {
    return Decimal.fromUserInput(valueString.toString(), decimals).atomics;
};

export const genericErrorHandler = (e:any, scope = new Scope()) => {
    console.error(e)
    Sentry.captureException(e, scope)
}

const delay = (ms:number) => new Promise(resolve => setTimeout(resolve, ms));

export async function pollAccountBalance(address:string, denom:string, rpc:string, availableAmount:string) {
    let initialBalance;
    if (availableAmount) {
        initialBalance = availableAmount
    } else {
        initialBalance = await fetchAccountBalance(address, denom, rpc)
    }

    console.log(initialBalance, "initialBalance")
    await delay(PollingConfig.initialTxHashQueryDelay);
    for (let i = 0; i < PollingConfig.numberOfRetries; i++) {
        try {
            const fetchResult = await fetchAccountBalance(address, denom, rpc);
            if (fetchResult !== "0" && fetchResult !== initialBalance) {
                return fetchResult;
            } else {
                throw Error("Balance unchanged");
            }
        } catch (error) {
            console.log(error);
            console.log("retrying in " + PollingConfig.scheduledTxHashQueryDelay + ": ", i, "th time");
            await delay(PollingConfig.scheduledTxHashQueryDelay);
        }
    }
    // return;
    return JSON.stringify({
        "txHash": address,
        "height": 0,
        "code": 111,
        "rawLog": "failed all retries"
    });
}

export const decodeTendermintClientStateAny = (clientState:any) => {
    if ((clientState === null || clientState === void 0 ? void 0 : clientState.typeUrl) !== "/ibc.lightclients.tendermint.v1.ClientState") {
        throw new Error(`Unexpected client state type: ${clientState === null || clientState === void 0 ? void 0 : clientState.typeUrl}`);
    }
    return tendermint.ClientState.decode(clientState.value);
};

// copied from node_modules/@cosmjs/stargate/build/queries/ibc.js
export const decodeTendermintConsensusStateAny = (consensusState:any) => {
    if ((consensusState === null || consensusState === void 0 ? void 0 : consensusState.typeUrl) !== "/ibc.lightclients.tendermint.v1.ConsensusState") {
        throw new Error(`Unexpected client state type: ${consensusState === null || consensusState === void 0 ? void 0 : consensusState.typeUrl}`);
    }
    return tendermint.ConsensusState.decode(consensusState.value);
};

export const printConsole = (message:string) => {
    if (process.env.NEXT_PUBLIC_ENVIRONMENT === TEST_NET) {
        console.log(message);
    }
}