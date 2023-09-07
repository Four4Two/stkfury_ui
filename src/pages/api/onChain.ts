import {
  QueryAllBalancesResponse,
  QueryClientImpl as BankQuery,
  QueryTotalSupplyResponse
} from "cosmjs-types/cosmos/bank/v1beta1/query";

import { QueryClientImpl as LiquidStakeQueryClient } from "persistenceonejs/pstake/liquidstakeibc/v1beta1/query";

import {
  QueryClientImpl as StakeQuery,
  QueryDelegatorDelegationsResponse,
  QueryDelegatorValidatorsResponse
} from "cosmjs-types/cosmos/staking/v1beta1/query";

import {
  decimalize,
  genericErrorHandler,
  getBaseRate,
  printConsole,
  RpcClient
} from "../../helpers/utils";

import { QueryClientImpl as EpochQueryClient } from "persistenceonejs/persistence/epochs/v1beta1/query";

import { Scope } from "@sentry/nextjs";
import { Coin } from "@cosmjs/proto-signing";
import moment from "moment";
import { ChainInfo } from "@keplr-wallet/types";
import {
  APR_BASE_RATE,
  APR_DEFAULT,
  COSMOS_UNBOND_TIME,
  STK_ATOM_MINIMAL_DENOM
} from "../../../AppConstants";
import { CHAIN_ID, ExternalChains } from "../../helpers/config";
import { StatusResponse, Tendermint34Client } from "@cosmjs/tendermint-rpc";
import {
  DelegatedValidator,
  DelegatedValidators
} from "../../store/reducers/transactions/stake/types";
import { getAvatar } from "./externalAPIs";
import { QueryClient, setupIbcExtension } from "@cosmjs/stargate";
import { Validator } from "cosmjs-types/cosmos/staking/v1beta1/staking";
import { Validator as PstakeValidator } from "persistenceonejs/pstake/liquidstakeibc/v1beta1/liquidstakeibc";

const env: string = process.env.NEXT_PUBLIC_ENVIRONMENT!;

const persistenceChainInfo = ExternalChains[env].find(
  (chain: ChainInfo) => chain.chainId === CHAIN_ID[env].persistenceChainID
);

const cosmosChainInfo = ExternalChains[env].find(
  (chain: ChainInfo) => chain.chainId === CHAIN_ID[env].persistenceChainID
);

export const getTokenBalance = (
  balances: QueryAllBalancesResponse,
  tokenDenom: string
) => {
  if (balances && balances!.balances!.length) {
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
};

export const fetchAccountBalance = async (
  address: string,
  rpc: string
): Promise<QueryAllBalancesResponse> => {
  try {
    const rpcClient = await RpcClient(rpc);
    const bankQueryService = new BankQuery(rpcClient);
    return await bankQueryService.AllBalances({
      address: address
    });
  } catch (error) {
    printConsole(error);
    return {
      balances: []
    };
  }
};

export const getExchangeRateFromRpc = async (
  rpc: string,
  chainId: string
): Promise<number> => {
  try {
    console.log(rpc, chainId, "chainIdchainId");
    const rpcClient = await RpcClient(rpc);
    const pstakeQueryService = new LiquidStakeQueryClient(rpcClient);
    const cvalue = await pstakeQueryService.ExchangeRate({
      chainId: chainId
    });
    console.log(cvalue, "-cosmos cvalue in getExchangeRateFromRpc", chainId);
    return Number(decimalize(cvalue.rate, 18));
  } catch (e) {
    console.log(e, "-cosmos error in getExchangeRateFromRpc");
    const customScope = new Scope();
    customScope.setLevel("fatal");
    customScope.setTags({
      "Error while fetching exchange rate": rpc
    });
    genericErrorHandler(e, customScope);
    return 1;
  }
};

export const getFee = async (
  rpc: string,
  hostChainId: string
): Promise<number> => {
  try {
    const rpcClient = await RpcClient(rpc);
    const pstakeQueryService = new LiquidStakeQueryClient(rpcClient);
    const chainParamsResponse = await pstakeQueryService.HostChain({
      chainId: hostChainId
    });
    const fee = chainParamsResponse!.hostChain!.params!.redemptionFee;
    return Number(Number(decimalize(fee, 18)).toFixed(6));
  } catch (e) {
    console.log(e, "-cosmos error in getFee");
    const customScope = new Scope();
    customScope.setLevel("fatal");
    customScope.setTags({
      "Error while fetching fee": rpc
    });
    genericErrorHandler(e, customScope);
    return 0;
  }
};

export const getChainTVU = async (
  rpc: string,
  denom: string
): Promise<number> => {
  try {
    const rpcClient = await RpcClient(rpc);
    const bankQueryService = new BankQuery(rpcClient);
    const supplyResponse: QueryTotalSupplyResponse =
      await bankQueryService.TotalSupply({});
    if (supplyResponse.supply.length) {
      const token: Coin | undefined = supplyResponse.supply.find(
        (item: Coin) => item.denom === denom
      );
      if (token !== undefined) {
        return Number(token?.amount);
      } else {
        return 0;
      }
    }
    return 0;
  } catch (e) {
    console.log(e, "-cosmos error in getChainTVU");
    const customScope = new Scope();
    customScope.setLevel("fatal");
    customScope.setTags({
      "Error while fetching chain tvu": rpc
    });
    genericErrorHandler(e, customScope);
    return 0;
  }
};

export const fetchUnbondingList = async (
  rpc: string,
  address: string,
  hostChainId: string
) => {
  try {
    const rpcClient = await RpcClient(rpc);
    const lsQueryService = new LiquidStakeQueryClient(rpcClient);
    const response = await lsQueryService.UserUnbondings({
      address: address
    });
    let list: any[] = [];
    let claimableAmount: number = 0;
    if (response.userUnbondings.length) {
      for (let item of response.userUnbondings) {
        if (hostChainId === item.chainId) {
          const unbondResponse = await lsQueryService.Unbonding({
            chainId: item.chainId,
            epoch: item.epochNumber
          });
          console.log(unbondResponse, "-cosmos unbondResponse");
          const unStakedon = moment(
            unbondResponse!.unbonding!.matureTime!.seconds.toNumber()! * 1000
          ).format("DD MMM YYYY hh:mm A");
          const unbondTime = await getUnbondTime(item.epochNumber, rpc);

          claimableAmount += Number(
            unbondResponse!.unbonding!.unbondAmount!.amount
          );
          list.push({
            unbondAmount: unbondResponse!.unbonding!.unbondAmount!.amount,
            unStakedon: unbondTime.time,
            daysRemaining: unbondTime.remainingDays
          });
        }
      }
    }
    return { list: list, claimableAmount: 0 };
  } catch (e) {
    console.log(e, "fetchUnbondingList");
    return { list: [], claimableAmount: 0 };
  }
};

const getUnbondTime = async (epochNumber: any, rpc: string) => {
  try {
    const epochInfo = await getEpochInfo(rpc);
    const currentEpochNumberResponse = await getCurrentEpoch(rpc);
    const currentEpochNumber =
      currentEpochNumberResponse.currentEpoch.toNumber();

    const nextEpochNumber = epochNumber.toNumber();
    const drs = epochInfo.epochs[0]?.duration?.seconds.toNumber()!;

    const diff = (nextEpochNumber - currentEpochNumber + 1) * drs;

    const tentativeTime = moment(
      epochInfo!.epochs[0]!.currentEpochStartTime?.seconds.toNumber()! * // ms conversion
        1000
    )
      .add(diff + COSMOS_UNBOND_TIME, "seconds")
      .local()
      .format("DD MMM YYYY hh:mm A");
    const remainingTime = moment(tentativeTime).fromNow(true);
    console.log(
      diff,
      remainingTime,
      "remainingTime",
      COSMOS_UNBOND_TIME,
      tentativeTime
    );
    return {
      time: tentativeTime,
      remainingDays: remainingTime
    };
  } catch (e) {
    return {
      time: 0,
      remainingDays: 0
    };
  }
};

export const getEpochInfo = async (rpc: string) => {
  const rpcClient = await RpcClient(rpc);
  const persistenceQueryService = new EpochQueryClient(rpcClient);
  return await persistenceQueryService.EpochInfos({});
};

export const getCurrentEpoch = async (rpc: string) => {
  const rpcClient = await RpcClient(rpc);
  const persistenceQueryService = new EpochQueryClient(rpcClient);
  return await persistenceQueryService.CurrentEpoch({
    identifier: "day"
  });
};

export const getMaxRedeem = async (
  rpc: string,
  chainId: string
): Promise<number> => {
  try {
    const rpcClient = await RpcClient(rpc);
    const pstakeQueryService = new LiquidStakeQueryClient(rpcClient);
    const moduleAccountResponse =
      await pstakeQueryService.DepositAccountBalance({ chainId: chainId });
    console.log(moduleAccountResponse, "moduleAccountResponse");
    return moduleAccountResponse
      ? Number(moduleAccountResponse.balance?.amount)
      : 0;
  } catch (e) {
    console.log(e, "cosmos error getMaxRedeem");
    const customScope = new Scope();
    customScope.setLevel("fatal");
    customScope.setTags({
      "Error while fetching max redeem": rpc
    });
    genericErrorHandler(e, customScope);
    return 0;
  }
};
export const getChainStatus = async (rpc: string): Promise<boolean> => {
  try {
    const tmClient: Tendermint34Client = await Tendermint34Client.connect(rpc);
    const status: StatusResponse = await tmClient.status();
    const latestBlockTime = status.syncInfo.latestBlockTime;
    const startTime = moment(latestBlockTime.toString()).format(
      "DD-MM-YYYY hh:mm:ss"
    );
    const endTime = moment().local().format("DD-MM-YYYY hh:mm:ss");
    const ms = moment(endTime, "DD/MM/YYYY HH:mm:ss").diff(
      moment(startTime, "DD/MM/YYYY HH:mm:ss")
    );
    const duration = moment.duration(ms);
    const seconds = duration.asSeconds();
    return seconds > 90;
  } catch (e) {
    const customScope = new Scope();
    customScope.setLevel("fatal");
    customScope.setTags({
      "Error while fetching chain status": rpc
    });
    genericErrorHandler(e, customScope);
    return true;
  }
};

export const getCosmosUnbondTime = async (rpc: string): Promise<number> => {
  try {
    const rpcClient = await RpcClient(rpc);
    const pstakeQueryService = new StakeQuery(rpcClient);
    const chainParamsResponse = await pstakeQueryService.Params({});
    if (chainParamsResponse.params?.unbondingTime?.seconds) {
      return chainParamsResponse.params?.unbondingTime?.seconds.toNumber();
    }
    return 0;
  } catch (e) {
    const customScope = new Scope();
    customScope.setLevel("fatal");
    customScope.setTags({
      "Error while fetching cosmos unbond time": rpc
    });
    genericErrorHandler(e, customScope);
    return 0;
  }
};

export const getValidators = async (
  rpc: string,
  hostChainId: string
): Promise<PstakeValidator[]> => {
  try {
    let validators: PstakeValidator[] = [];
    const rpcClient = await RpcClient(rpc);
    const pstakeQueryService = new LiquidStakeQueryClient(rpcClient);
    const chainParamsResponse = await pstakeQueryService.HostChain({
      chainId: hostChainId
    });
    if (chainParamsResponse && chainParamsResponse.hostChain?.validators) {
      validators = chainParamsResponse.hostChain?.validators;
    }
    return validators;
  } catch (e) {
    return [];
  }
};

export const getDelegations = async (
  address: string,
  rpc: string,
  validators: PstakeValidator[]
): Promise<DelegatedValidators> => {
  try {
    console.log(address, rpc, "params getDelegations");
    const delegations: DelegatedValidator[] = [];
    let totalAmount: number = 0;
    const rpcClient = await RpcClient(rpc);
    const stakingQueryService = new StakeQuery(rpcClient);
    const delegationsResponse: QueryDelegatorDelegationsResponse =
      await stakingQueryService.DelegatorDelegations({
        delegatorAddr: address
      });

    const delegatedValidators: QueryDelegatorValidatorsResponse =
      await stakingQueryService.DelegatorValidators({
        delegatorAddr: address
      });
    console.log(delegatedValidators, "delegatedValidators");

    if (delegationsResponse.delegationResponses.length > 0) {
      totalAmount = delegationsResponse.delegationResponses.reduce(
        (accumulator, object) => {
          return accumulator + Number(object?.balance?.amount);
        },
        0
      );
      for (const delegation of delegationsResponse.delegationResponses) {
        const validator = delegatedValidators.validators.find(
          (validator: Validator) => {
            return (
              validator.operatorAddress ===
              delegation.delegation?.validatorAddress
            );
          }
        );
        console.log(
          validator,
          "validator-123",
          decimalize(delegation.balance?.amount!),
          delegation.balance?.amount
        );
        const validatorCheck = validators.find(
          (item) => item.operatorAddress === validator!.operatorAddress
        );
        console.log(validatorCheck, "validatorCheck");
        delegations.push({
          name: validator!.description?.moniker!,
          identity: await getAvatar(validator!.description?.identity!),
          amount: decimalize(delegation.balance?.amount!),
          inputAmount: "",
          validatorAddress: validator!.operatorAddress,
          status:
            validatorCheck !== undefined &&
            !validator!.jailed &&
            validator!.status === 3
        });
      }
    }

    return {
      list: delegations,
      totalAmount: decimalize(totalAmount)
    };
  } catch (e) {
    const customScope = new Scope();
    customScope.setLevel("fatal");
    customScope.setTags({
      "Error while fetching delegation": rpc
    });
    genericErrorHandler(e, customScope);
    return {
      list: [],
      totalAmount: 0
    };
  }
};

export const getTokenizedSharesFromBalance = async (
  balances: QueryAllBalancesResponse,
  address: string,
  rpc: string,
  prefix: string
) => {
  try {
    const tendermintClient = await Tendermint34Client.connect(rpc);
    const queryClient = new QueryClient(tendermintClient);
    console.log(balances, "response-123");
    if (balances && balances!.balances!.length) {
      let balancesList: Coin[] = [];
      for (let item of balances!.balances) {
        console.log(item, "item-123");
        if (item.denom.includes("ibc/")) {
          const ibcExtension = setupIbcExtension(queryClient);
          let ibcDenomeResponse = await ibcExtension.ibc.transfer.denomTrace(
            item.denom
          );
          if (ibcDenomeResponse!.denomTrace!.baseDenom.includes(prefix)) {
            const balance = {
              denom: item.denom,
              baseDenom: ibcDenomeResponse!.denomTrace!.baseDenom,
              amount: item.amount
            };
            balancesList.push(balance);
            console.log(ibcDenomeResponse, "ibcDenomeResponse");
          }
        }
      }
      return balancesList.length > 1
        ? balancesList.sort(
            (a, b) =>
              Number(a.denom.substring(a.denom.length - 1)) -
              Number(b.denom.substring(b.denom.length - 1))
          )
        : balancesList;
    }
    return [];
  } catch (error) {
    printConsole(error);
    return [];
  }
};
