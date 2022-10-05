import {
  QueryAllBalancesResponse,
  QueryClientImpl as BankQuery
} from "cosmjs-types/cosmos/bank/v1beta1/query";
import {
  decimalize,
  genericErrorHandler,
  getCommission,
  getIncentives,
  RpcClient
} from "../../helpers/utils";
import { QueryClientImpl } from "../../helpers/proto-codecs/codec/pstake/pstake/lscosmos/v1beta1/query";
import { Scope } from "@sentry/react";
import { Coin } from "@cosmjs/proto-signing";
import { QueryClientImpl as StakingQueryClient } from "cosmjs-types/cosmos/staking/v1beta1/query";

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

export const getAPR = async () => {
  try {
    const baseRate = 18.92;
    const commission = await getCommission();
    const incentives = await getIncentives();
    const apr = baseRate - commission + incentives;
    return apr;
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
