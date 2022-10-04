import {
  QueryAllBalancesResponse,
  QueryClientImpl as BankQuery
} from "cosmjs-types/cosmos/bank/v1beta1/query";
import { decimalize, genericErrorHandler, RpcClient } from "../../helpers/utils";
import { QueryClientImpl } from "../../helpers/proto-codecs/codec/pstake/pstake/lscosmos/v1beta1/query";
import {Scope} from "@sentry/react";
import { Coin } from "@cosmjs/proto-signing";

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
