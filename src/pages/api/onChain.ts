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
  QueryClientImpl,
  QueryFailedUnbondingsResponse,
  QueryPendingUnbondingsResponse,
  QueryUnclaimedResponse
} from "../../helpers/proto-codecs/codec/pstake/pstake/lscosmos/v1beta1/query";
import {Scope} from "@sentry/react";
import {Coin} from "@cosmjs/proto-signing";
import Long from "long";
import moment from "moment";

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
    const apr = baseRate - commission + incentives;
    return apr.toFixed(2);
  } catch (e) {
    const customScope = new Scope();
    customScope.setLevel("fatal");
    customScope.setTags({
      "Error while fetching exchange rate":
        "https://rpc.devnet.persistence.pstake.finance"
    });
    genericErrorHandler(e, customScope);
    return 0;
  }
};

export const fetchAccountClaims = async (address: string, rpc: string) => {
  try {
    const filteredClaims: Array<any> = [];
    const rpcClient = await RpcClient(rpc);
    const pstakeQueryService: QueryClientImpl = new QueryClientImpl(rpcClient);

    const unbondingsResponse: QueryPendingUnbondingsResponse =
      await pstakeQueryService.PendingUnbondings({
        delegatorAddress: address
      });
    printConsole(unbondingsResponse, "unbondAmountResponse");

    if (unbondingsResponse.pendingUnbondings.length) {
      for (let item of unbondingsResponse.pendingUnbondings) {
        const cvalue: number =
          Number(item.sTKBurn?.amount) / Number(item.amountUnbonded?.amount);

        const epochNumber = item.epochNumber;
        const unbondAmountResponse: any = await getUnbondingAmount(
          address,
          epochNumber,
          pstakeQueryService
        );

        if (cvalue && unbondAmountResponse) {
          const unbondAmount =
            unbondAmountResponse.delegatorUnbodingEpochEntry?.amount?.amount /
            cvalue;

          const unbondTimeResponse: any = await getUnbondingTime(
            epochNumber,
            pstakeQueryService
          );

          const unbondTime =
            unbondTimeResponse.hostAccountUndelegation.completionTime;

          const given = moment(unbondTime, "YYYY-MM-DD");

          const currentDate = moment();

          const daysRemaining = given.diff(currentDate, "days");

          let unStakedon = given.utc().format("DD MMM YYYY hh:mm A UTC");

          printConsole(daysRemaining, "daysRemaining");

          filteredClaims.push({
            unbondAmount,
            unStakedon,
            daysRemaining: 0
          });
        }
      }
    }
    return filteredClaims;
  } catch (error) {
    const customScope = new Scope();
    customScope.setLevel("fatal");
    customScope.setTags({
      "Error while fetching pending claims": rpc
    });
    genericErrorHandler(error, customScope);
    return [];
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

export const getUnbondingTime = async (
  epochNumber: Long,
  queryService: QueryClientImpl
) => {
  return await queryService.HostAccountUndelegation({
    epochNumber: epochNumber
  });
};

export const fetchClaimableAmount = async (address: string, rpc: string) => {
  try {
    const rpcClient = await RpcClient(rpc);
    const pstakeQueryService = new QueryClientImpl(rpcClient);
    const claimableBalanceTotal: QueryUnclaimedResponse =
      await pstakeQueryService.Unclaimed({ delegatorAddress: address });
    printConsole(claimableBalanceTotal,"claimableBalanceTotal");
    let claimableAmount: number = 0;
    if (claimableBalanceTotal.unclaimed.length) {
      for (let item of claimableBalanceTotal.unclaimed) {
        const epochNumber = item.epochNumber;
        const cvalue: any =
          Number(item.sTKBurn?.amount) / Number(item.amountUnbonded?.amount);
        const unbondAmountResponse: any = await getUnbondingAmount(
          address,
          epochNumber,
          pstakeQueryService
        );
        const unbondAmount =
          unbondAmountResponse.delegatorUnbodingEpochEntry.amount.amount /
          cvalue;
        claimableAmount += Number(unbondAmount);
      }
    }
    return claimableAmount;
  } catch (e) {
    const customScope = new Scope();
    customScope.setLevel("fatal");
    customScope.setTags({
      "Error while fetching claimable amount": rpc
    });
    genericErrorHandler(e, customScope);
    return 0;
  }
};

export const fetchFailedUnbondings = async (address: string, rpc: string) => {
  try {
    const rpcClient = await RpcClient(rpc);
    const pstakeQueryService = new QueryClientImpl(rpcClient);
    const failedUnbondingResponse: QueryFailedUnbondingsResponse =
        await pstakeQueryService.FailedUnbondings({ delegatorAddress: address });
    let totalFailedUnbondAmount: number = 0;
    if (failedUnbondingResponse.failedUnbondings.length) {
      for (let item of failedUnbondingResponse.failedUnbondings) {

        const epochNumber = item.epochNumber;
        const failedUnbondAmountResponse: any = await getUnbondingAmount(
            address,
            epochNumber,
            pstakeQueryService
        );

        if (failedUnbondAmountResponse) {
          const failedUnbondAmount =
              failedUnbondAmountResponse.delegatorUnbodingEpochEntry?.amount?.amount;
          totalFailedUnbondAmount += Number(failedUnbondAmount);
        }
      }
    }
    return totalFailedUnbondAmount!;
  } catch (e) {
    const customScope = new Scope();
    customScope.setLevel("fatal");
    customScope.setTags({
      "Error while fetching failed unbondings": rpc
    });
    genericErrorHandler(e, customScope);
    return 0;
  }
};
