import {QueryAllBalancesResponse, QueryClientImpl as BankQuery} from "cosmjs-types/cosmos/bank/v1beta1/query";
import {decimalize, genericErrorHandler, printConsole, RpcClient} from "../../helpers/utils";
import {
  QueryClientImpl,
  QueryPendingUnbondingsResponse,
  QueryUnclaimedResponse
} from "../../helpers/proto-codecs/codec/pstake/pstake/lscosmos/v1beta1/query";
import {Scope} from "@sentry/react";
import {Coin} from "@cosmjs/proto-signing";
import Long from "long";
import moment from "moment";

export const fetchAccountBalance = async (address: string, tokenDenom: string, rpc: string) => {
  try {
    const rpcClient = await RpcClient(rpc);
    const bankQueryService = new BankQuery(rpcClient);
    const balances:QueryAllBalancesResponse = await bankQueryService.AllBalances({
      address: address,
    })
    if (balances.balances.length) {
      const token:Coin | undefined  = balances.balances.find((item:Coin) => item.denom === tokenDenom);
      if (token === undefined){
        return "0"
      } else {
        return token!.amount
      }
    } else {
      return "0";
    }
  } catch (error) {
    console.log(error);
    return "0";
  }
};

export const getExchangeRate = async (rpc:string) => {
  try {
    const rpcClient = await RpcClient(rpc);
    const pstakeQueryService = new QueryClientImpl(rpcClient);
    const cvalue = await pstakeQueryService.CValue({})
    return Number(Number(decimalize(cvalue.cValue, 18)).toFixed(6));
  } catch (e) {
    const customScope = new Scope();
    customScope.setLevel("fatal")
    customScope.setTags({
      "Error while fetching exchange rate": rpc
    })
    genericErrorHandler(e, customScope)
    return 1
  }
}

export const fetchAccountClaims = async (address:string, rpc: string) => {
  try {
    const filteredClaims:Array<any> = [];
    const rpcClient = await RpcClient(rpc);
    const pstakeQueryService:QueryClientImpl = new QueryClientImpl(rpcClient);

    const unbondingsResponse:QueryPendingUnbondingsResponse = await pstakeQueryService.PendingUnbondings({
      delegatorAddress: address,
    })
    console.log(unbondingsResponse,"unbondAmountResponse");

    if (unbondingsResponse.pendingUnbondings.length) {
      for (let item of unbondingsResponse.pendingUnbondings) {

        const cvalue:number = (Number(item.sTKBurn?.amount) / Number(item.amountUnbonded?.amount))

        const epochNumber = item.epochNumber;
        const unbondAmountResponse:any = await getUnbondingAmount(address, epochNumber, pstakeQueryService);

        const unbondAmount = unbondAmountResponse.delegatorUnbodingEpochEntry.amount.amount / cvalue;

        const unbondTimeResponse:any = await getUnbondingTime(epochNumber, pstakeQueryService);

        const unbondTime = unbondTimeResponse.hostAccountUndelegation.completionTime;

        const given = moment(unbondTime, "YYYY-MM-DD");

        const currentDate = moment();

        // const daysRemaining = given.diff(currentDate, 'days')

        let unStakedon = given.utc().format('DD MMM YYYY hh:mm A UTC');
        //
        // printConsole(unbondAmount+ unStakedon +daysRemaining + "filteredClaims data");

        filteredClaims.push({unbondAmount, unStakedon, daysRemaining:0})
      }
    }
    return filteredClaims;
  } catch (error) {
    const customScope = new Scope();
    customScope.setLevel("fatal")
    customScope.setTags({
      "Error while fetching exchange rate": rpc
    })
    genericErrorHandler(error, customScope)
    return []
  }
};

export const getUnbondingAmount = async (address:string, epochNumber:Long, queryService:QueryClientImpl) => {
  return await queryService.DelegatorUnbondingEpochEntry(
      {delegatorAddress: address, epochNumber: epochNumber}
  );
}

export const getUnbondingTime = async (epochNumber:Long, queryService:QueryClientImpl) => {
  return await queryService.HostAccountUndelegation(
      {epochNumber: epochNumber}
  );
}

export const fetchClaimableAmount = async (address:string, rpc:string) => {
  try {

    const rpcClient = await RpcClient(rpc);
    const pstakeQueryService = new QueryClientImpl(rpcClient);
    const claimableBalanceTotal:QueryUnclaimedResponse = await pstakeQueryService.Unclaimed({delegatorAddress : address})

    let claimableAmount:number = 0;
    if (claimableBalanceTotal.unclaimed.length) {
      for (let item of claimableBalanceTotal.unclaimed) {
        const epochNumber = item.epochNumber;
        const cvalue:any = (Number(item.sTKBurn?.amount) / Number(item.amountUnbonded?.amount))
        const unbondAmountResponse: any = await getUnbondingAmount(address, epochNumber, pstakeQueryService);
        const unbondAmount = unbondAmountResponse.delegatorUnbodingEpochEntry.amount.amount / cvalue;
        claimableAmount += Number(unbondAmount)
      }
    }

    return claimableAmount!;

  } catch (e) {
    const customScope = new Scope();
    customScope.setLevel("fatal")
    customScope.setTags({
      "Error while fetching exchange rate": rpc
    })
    genericErrorHandler(e, customScope)
    return 0
  }
}