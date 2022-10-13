import {QueryAllBalancesResponse, QueryClientImpl as BankQuery} from "cosmjs-types/cosmos/bank/v1beta1/query";
import {
  decimalize,
  genericErrorHandler,
  getCommission,
  getIncentives,
  printConsole,
  RpcClient
} from "../../helpers/utils";

import {
  QueryAllDelegatorUnbondingEpochEntriesResponse,
  QueryClientImpl,
  QueryFailedUnbondingsResponse,
  QueryPendingUnbondingsResponse, QueryUnbondingEpochCValueResponse,
  QueryUnclaimedResponse
} from "../../helpers/proto-codecs/codec/pstake/pstake/lscosmos/v1beta1/query";

import {
  QueryClientImpl as EpochQueryClient,
} from "../../helpers/proto-codecs/codec/persistence/epochs/v1beta1/query";

import {Scope} from "@sentry/react";
import {Coin} from "@cosmjs/proto-signing";
import Long from "long";
import moment from "moment";
import { ChainInfo } from "@keplr-wallet/types";
import { PERSISTENCE_CHAIN_ID } from "../../../AppConstants";
import { ExternalChains } from "../../helpers/config";

const env: string = process.env.NEXT_PUBLIC_ENVIRONMENT!;

const persistenceChainInfo = ExternalChains[env].find(
  (chain: ChainInfo) => chain.chainId === PERSISTENCE_CHAIN_ID
);

export const fetchAccountBalance = async (
  address: string,
  tokenDenom: string,
  rpc: string
) => {
  try {
    const rpcClient = await RpcClient(rpc);
    const bankQueryService = new BankQuery(rpcClient);
    const balances: QueryAllBalancesResponse =
      await bankQueryService.AllBalances({
        address: address
      });
    if (balances.balances.length) {
      const token: Coin | undefined = balances.balances.find(
        (item: Coin) => item.denom === tokenDenom
      );
      if (token === undefined) {
        return "0";
      } else {
        return token!.amount;
      }
    } else {
      return "0";
    }
  } catch (error) {
    console.log(error);
    return "0";
  }
};

export const getExchangeRate = async (rpc: string) => {
  try {
    const rpcClient = await RpcClient(rpc);
    const pstakeQueryService = new QueryClientImpl(rpcClient);
    const cvalue = await pstakeQueryService.CValue({});
    return Number(Number(decimalize(cvalue.cValue, 18)).toFixed(6));
  } catch (e) {
    const customScope = new Scope();
    customScope.setLevel("fatal");
    customScope.setTags({
      "Error while fetching exchange rate": rpc
    });
    genericErrorHandler(e, customScope);
    return 1;
  }
};


export const getFee = async (rpc: string) => {
  try {
    const rpcClient = await RpcClient(rpc);
    const pstakeQueryService = new QueryClientImpl(rpcClient);
    const chainParamsResponse = await pstakeQueryService.HostChainParams({});
    const fee = chainParamsResponse.hostChainParams?.pstakeParams?.pstakeRedemptionFee!
    return Number(Number(decimalize(fee, 18)).toFixed(6));
  } catch (e) {
    const customScope = new Scope();
    customScope.setLevel("fatal");
    customScope.setTags({
      "Error while fetching exchange rate": rpc
    });
    genericErrorHandler(e, customScope);
    return 0;
  }
};

export const getAPR = async () => {
  try {
    const baseRate = 18.92;
    const commission = await getCommission();
    const incentives = await getIncentives();
    const apr = baseRate - (commission / 100) * baseRate + incentives;
    return apr.toFixed(2);
  } catch (e) {
    const customScope = new Scope();
    customScope.setLevel("fatal");
    customScope.setTags({
      "Error while fetching exchange rate": persistenceChainInfo?.rpc
    });
    genericErrorHandler(e, customScope);
    return 0;
  }
};

export const fetchAllEpochEntries = async (address: string, rpc: string) => {
  try {
    const filteredPendingClaims: Array<any> = [];
    const filteredUnlistedPendingClaims: Array<any> = [];
    let totalFailedUnbondAmount: number = 0;
    let claimableAmount: number = 0;
    const rpcClient = await RpcClient(rpc);
    const pstakeQueryService: QueryClientImpl = new QueryClientImpl(rpcClient);

    const epochEntriesResponse: QueryAllDelegatorUnbondingEpochEntriesResponse =
        await pstakeQueryService.DelegatorUnbondingEpochEntries({
          delegatorAddress: address
        });

    if (epochEntriesResponse.delegatorUnbondingEpochEntries.length) {
      for (let item of epochEntriesResponse.delegatorUnbondingEpochEntries) {
        const epochNumber = item.epochNumber;

        const unbondEpochResponse: QueryUnbondingEpochCValueResponse = await getUnbondingEpochCvalue(
            epochNumber,
            pstakeQueryService
        );
        const isFailed:boolean = unbondEpochResponse.unbondingEpochCValue?.isFailed!;
        const isMatured:boolean = unbondEpochResponse.unbondingEpochCValue?.isMatured!;
        const cValueEpochNumber:Long = unbondEpochResponse.unbondingEpochCValue?.epochNumber!;
        const amount:string = unbondEpochResponse.unbondingEpochCValue?.amountUnbonded?.amount!;
        // pending unbonding list
        if (!isFailed && !isMatured && cValueEpochNumber.toNumber() > 0){
          const unbondTimeResponse: any = await getUnbondingTime(
              epochNumber,
              pstakeQueryService
          );

          const unbondTime =
              unbondTimeResponse.hostAccountUndelegation.completionTime;

          const epochInfo =  await getEpochInfo(rpc);
          const currentEpochNumberResponse = await getCurrentEpoch(rpc);

          const currentEpochNumber = currentEpochNumberResponse.currentEpoch.toNumber()
          const unbondEpochNumber = epochNumber.toNumber();

          const drs = epochInfo.epochs[0]?.duration?.seconds.toNumber()!

          const diff = ((unbondEpochNumber - currentEpochNumber)+1)*drs

          const actualTime = moment(epochInfo.epochs[0].currentEpochStartTime).add(diff, 'seconds').format();

          printConsole(actualTime, "actualTime");

          const given = moment(unbondTime, "YYYY-MM-DD");

          const currentDate = moment();

          const daysRemaining = given.diff(currentDate, "days");

          let unStakedon = given.utc().format("DD MMM YYYY hh:mm A UTC");

          filteredPendingClaims.push({
            unbondAmount:amount,
            unStakedon,
            daysRemaining
          });
        }else if (isFailed && cValueEpochNumber.toNumber() > 0){ // failed unbonding list
            totalFailedUnbondAmount += Number(amount);
        } else if (isMatured && cValueEpochNumber.toNumber() > 0){ // claimable unbonding list
          claimableAmount += Number(amount);
        }else { // unlisted pending unbonding list
          const epochInfo =  await getEpochInfo(rpc);
          const currentEpochNumberResponse = await getCurrentEpoch(rpc);
          const currentEpochNumber = currentEpochNumberResponse.currentEpoch.toNumber()

          const nextEpochNumber = epochNumber.toNumber();
          const drs = epochInfo.epochs[0]?.duration?.seconds.toNumber()!

          const diff = ((nextEpochNumber - currentEpochNumber)+1)*drs
          const tentativeTime = moment(epochInfo.epochs[0].currentEpochStartTime).add(diff, 'seconds').format();

          printConsole(tentativeTime, "tentativeTime");

          filteredUnlistedPendingClaims.push({
            unbondAmount: item.amount?.amount,
            unStakedon: tentativeTime,
            daysRemaining: 0
          });
        }
      }
    }
    return {
      filteredPendingClaims,
      totalFailedUnbondAmount,
      claimableAmount,
      filteredUnlistedPendingClaims
    };
  } catch (error) {
    const customScope = new Scope();
    customScope.setLevel("fatal");
    customScope.setTags({
      "Error while fetching pending claims": rpc
    });
    genericErrorHandler(error, customScope);
    return {
      filteredPendingClaims:[],
      totalFailedUnbondAmount:0,
      claimableAmount:0,
      filteredUnlistedPendingClaims:[]
    };
  }
};

export const getUnbondingAmount = async (
  address: string,
  epochNumber: Long,
  queryService: QueryClientImpl
) => {
  return await queryService.DelegatorUnbondingEpochEntry({
    delegatorAddress: address,
    epochNumber: epochNumber
  });
};

export const getEpochInfo = async (rpc:string) => {
  const rpcClient = await RpcClient(rpc);
  const persistenceQueryService = new EpochQueryClient(rpcClient);
  return await persistenceQueryService.EpochInfos({});
};

export const getCurrentEpoch = async (rpc:string) => {
  const rpcClient = await RpcClient(rpc);
  const persistenceQueryService = new EpochQueryClient(rpcClient);
  return await persistenceQueryService.CurrentEpoch({
    identifier:'day'
  });
};

export const getUnbondingEpochCvalue = async (
    epochNumber: Long,
    queryService: QueryClientImpl
) => {
  return await queryService.UnbondingEpochCValue({
    epochNumber: epochNumber
  });
};

export const getUnbondingTime = async (
  epochNumber: Long,
  queryService: QueryClientImpl
) => {
  return await queryService.HostAccountUndelegation({
    epochNumber: epochNumber
  });
};


