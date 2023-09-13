import { put, select } from "@redux-saga/core/effects";
import {
  DelegationStakeTransactionPayload,
  StakeTransactionPayload,
  TokenizedShareStakeTransactionPayload
} from "../reducers/transactions/stake/types";
import {
  resetTransaction,
  setTransactionProgress
} from "../reducers/transaction";
import {
  COSMOS_FEE,
  EMPTY_POOL_ERROR,
  ERROR_WHILE_CLAIMING,
  ERROR_WHILE_DEPOSITING,
  ERROR_WHILE_STAKING,
  ERROR_WHILE_UNSTAKING,
  FATAL,
  INSTANT,
  MIN_STAKE,
  PERSISTENCE_FEE,
  STAKE,
  STK_ATOM_MINIMAL_DENOM
} from "../../../AppConstants";
import {
  executeStakeTransactionSaga,
  setStakeAmount,
  setStakeTxnFailed,
  setStakeTxnStepNumber
} from "../reducers/transactions/stake";
import { MakeIBCTransferMsg, Transaction } from "../../helpers/transaction";
import { DeliverTxResponse } from "@cosmjs/stargate/build/stargateclient";
import { displayToast } from "../../components/molecules/toast";
import { ToastType } from "../../components/molecules/toast/types";
import {
  decimalize,
  genericErrorHandler,
  pollAccountBalance,
  pollAccountBalanceList,
  printConsole
} from "../../helpers/utils";
import {
  failedTransactionActions,
  postTransactionActions
} from "./sagaHelpers";
import * as Sentry from "@sentry/nextjs";
import {
  UnStakeTransactionPayload,
  unStakeType
} from "../reducers/transactions/unstake/types";
import { toast } from "react-toastify";
import { DepositTransactionPayload } from "../reducers/transactions/deposit/types";
import {
  CHAIN_ID,
  IBCChainInfos,
  IBCConfiguration
} from "../../helpers/config";
import { RootState } from "../reducers";
import { ClaimTransactionPayload } from "../reducers/transactions/claim/types";
import { setDepositAmount } from "../reducers/transactions/deposit";
import { setUnStakeAmount } from "../reducers/transactions/unstake";
import { WithdrawTransactionPayload } from "../reducers/transactions/withdraw/types";
import {
  setWithdrawTxnFailed,
  setWithdrawTxnStepNumber
} from "../reducers/transactions/withdraw";
import {
  fetchAccountBalance,
  getTokenizedSharesFromBalance
} from "../../pages/api/onChain";
import { QueryAllBalancesResponse } from "cosmjs-types/cosmos/bank/v1beta1/query";
import { LiquidStakeLsmMsg } from "../../helpers/protoMsg";

const env: string = process.env.NEXT_PUBLIC_ENVIRONMENT!;

let ibcInfo = IBCChainInfos[env].find(
  (chain) => chain.counterpartyChainId === CHAIN_ID[env].cosmosChainID
);

export function* executeStakeTransaction({ payload }: StakeTransactionPayload) {
  const {
    persistenceSigner,
    persistenceChainInfo,
    account,
    msg,
    pollInitialBalance,
    cosmosAddress,
    cosmosChainInfo
  } = payload;
  try {
    const transaction: DeliverTxResponse = yield Transaction(
      persistenceSigner,
      account,
      [msg],
      PERSISTENCE_FEE,
      "",
      persistenceChainInfo.rpc
    );
    yield put(setStakeTxnStepNumber(4));
    printConsole(transaction, "transaction stake");
    if (transaction.code === 0) {
      const response: string = yield pollAccountBalance(
        account,
        STK_ATOM_MINIMAL_DENOM,
        persistenceChainInfo.rpc,
        pollInitialBalance.toString()
      );
      if (response !== "0") {
        yield put(setStakeTxnStepNumber(5));
        yield postTransactionActions(
          "stake",
          account,
          cosmosAddress,
          persistenceChainInfo,
          cosmosChainInfo
        );
      }
      yield put(resetTransaction());
    } else {
      throw new Error(transaction.rawLog);
    }
  } catch (e: any) {
    yield put(setStakeTxnFailed(true));
    yield put(resetTransaction());
    const customScope = new Sentry.Scope();
    customScope.setLevel(FATAL);
    customScope.setTags({
      [ERROR_WHILE_STAKING]: payload.account,
      cosmosAddress
    });
    yield postTransactionActions(
      "stake",
      account,
      cosmosAddress,
      persistenceChainInfo,
      cosmosChainInfo
    );
    genericErrorHandler(e, customScope);
  }
}

export function* executeUnStakeTransaction({
  payload
}: UnStakeTransactionPayload) {
  const {
    persistenceSigner,
    persistenceChainInfo,
    address,
    msg,
    pollInitialBalance,
    cosmosAddress,
    cosmosChainInfo
  } = payload;
  try {
    const transaction: DeliverTxResponse = yield Transaction(
      persistenceSigner,
      address,
      msg,
      PERSISTENCE_FEE,
      "",
      persistenceChainInfo.rpc
    );
    printConsole(transaction, "transaction unstake");
    yield put(setUnStakeAmount(""));
    if (transaction.code === 0) {
      const state: RootState = yield select();
      const txnType: unStakeType = state?.unStake.type;
      if (txnType === INSTANT) {
        displayToast(
          {
            message: "Transaction in progress"
          },
          ToastType.LOADING
        );
        const response: string = yield pollAccountBalance(
          cosmosAddress,
          cosmosChainInfo?.stakeCurrency.coinMinimalDenom!,
          cosmosChainInfo.rpc,
          pollInitialBalance.toString()
        );
        if (response !== "0") {
          toast.dismiss();
          yield postTransactionActions(
            "unstake",
            address,
            cosmosAddress,
            persistenceChainInfo,
            cosmosChainInfo
          );
          displayToast(
            {
              message: "Transaction Successful"
            },
            ToastType.SUCCESS
          );
        } else {
          displayToast(
            {
              message: "This transaction could not be completed"
            },
            ToastType.ERROR
          );
        }
      } else {
        yield postTransactionActions(
          "unstake",
          address,
          cosmosAddress,
          persistenceChainInfo,
          cosmosChainInfo
        );
        displayToast(
          {
            message: "Transaction Successful"
          },
          ToastType.SUCCESS
        );
      }
      yield put(resetTransaction());
    } else {
      throw new Error(transaction.rawLog);
    }
  } catch (e: any) {
    yield put(resetTransaction());
    const customScope = new Sentry.Scope();
    customScope.setLevel(FATAL);
    customScope.setTags({
      [ERROR_WHILE_UNSTAKING]: payload.address
    });
    genericErrorHandler(e, customScope);
    yield postTransactionActions(
      "unstake",
      address,
      cosmosAddress,
      persistenceChainInfo,
      cosmosChainInfo
    );
    if (e.message && e.message.includes(EMPTY_POOL_ERROR)) {
      displayToast(
        {
          message: "This transaction could not be completed"
        },
        ToastType.ERROR
      );
      yield put(resetTransaction());
    } else {
      yield failedTransactionActions("");
    }
  }
}

export function* executeClaimTransaction({ payload }: ClaimTransactionPayload) {
  const {
    persistenceSigner,
    persistenceChainInfo,
    address,
    msg,
    cosmosChainInfo,
    cosmosAddress,
    pollInitialIBCAtomBalance,
    claimType
  } = payload;
  try {
    const transaction: DeliverTxResponse = yield Transaction(
      persistenceSigner,
      address,
      msg,
      COSMOS_FEE,
      "",
      persistenceChainInfo.rpc
    );
    printConsole(transaction, "transaction claim");
    if (transaction.code === 0) {
      displayToast(
        {
          message: "Transaction in progress"
        },
        ToastType.LOADING
      );

      const response: string = yield pollAccountBalance(
        claimType === "claimAll" ? cosmosAddress : address,
        claimType === "claimAll"
          ? cosmosChainInfo?.stakeCurrency.coinMinimalDenom!
          : STK_ATOM_MINIMAL_DENOM,
        claimType === "claimAll"
          ? cosmosChainInfo.rpc
          : persistenceChainInfo.rpc,
        pollInitialIBCAtomBalance.toString()
      );

      if (response !== "0") {
        yield postTransactionActions(
          "claim",
          address,
          cosmosAddress,
          persistenceChainInfo,
          cosmosChainInfo
        );
        displayToast(
          {
            message: "Transaction Successful"
          },
          ToastType.SUCCESS
        );
      }
      yield put(resetTransaction());
    } else {
      throw new Error(transaction.rawLog);
    }
  } catch (e: any) {
    yield put(resetTransaction());
    const customScope = new Sentry.Scope();
    customScope.setLevel(FATAL);
    customScope.setTags({
      [ERROR_WHILE_CLAIMING]: payload.address
    });
    genericErrorHandler(e, customScope);
    yield postTransactionActions(
      "claim",
      address,
      cosmosAddress,
      persistenceChainInfo,
      cosmosChainInfo
    );
    yield failedTransactionActions("");
  }
}

export function* executeDepositTransaction({
  payload
}: DepositTransactionPayload) {
  const {
    persistenceChainInfo,
    cosmosSigner,
    cosmosChainInfo,
    depositMsg,
    persistenceSigner,
    stakeMsg,
    persistenceAddress,
    cosmosAddress,
    pollInitialDepositBalance,
    pollInitialStakeBalance
  } = payload;
  try {
    yield put(setStakeTxnStepNumber(1));
    const transaction: DeliverTxResponse = yield Transaction(
      cosmosSigner,
      cosmosAddress,
      [depositMsg],
      COSMOS_FEE,
      "",
      cosmosChainInfo.rpc
    );
    yield put(setStakeTxnStepNumber(2));
    printConsole(transaction, "transaction deposit");
    yield put(setDepositAmount(""));
    if (transaction.code === 0) {
      const response: string = yield pollAccountBalance(
        persistenceAddress,
        ibcInfo!.coinDenom,
        persistenceChainInfo.rpc,
        pollInitialDepositBalance.toString()
      );
      if (response !== "0") {
        yield postTransactionActions(
          "deposit",
          persistenceAddress,
          cosmosAddress,
          persistenceChainInfo,
          cosmosChainInfo
        );
        yield put(setStakeTxnStepNumber(3));
        yield put(
          executeStakeTransactionSaga({
            persistenceSigner: persistenceSigner!,
            msg: stakeMsg,
            account: persistenceAddress,
            persistenceChainInfo: persistenceChainInfo!,
            pollInitialBalance: pollInitialStakeBalance,
            cosmosAddress,
            cosmosChainInfo
          })
        );
        yield put(setTransactionProgress(STAKE));
      }
    } else {
      throw new Error(transaction.rawLog);
    }
  } catch (e: any) {
    yield put(setStakeTxnFailed(true));
    const customScope = new Sentry.Scope();
    customScope.setLevel(FATAL);
    customScope.setTags({
      [ERROR_WHILE_DEPOSITING]: payload.persistenceAddress
    });
    yield postTransactionActions(
      "deposit",
      persistenceAddress,
      cosmosAddress,
      persistenceChainInfo,
      cosmosChainInfo
    );
    genericErrorHandler(e, customScope);
  }
}

export function* executeWithdrawTransaction({
  payload
}: WithdrawTransactionPayload) {
  const {
    persistenceChainInfo,
    cosmosChainInfo,
    withdrawMsg,
    persistenceAddress,
    cosmosAddress,
    persistenceSigner,
    pollInitialIBCAtomBalance
  } = payload;
  try {
    yield put(setWithdrawTxnStepNumber(1));
    const transaction: DeliverTxResponse = yield Transaction(
      persistenceSigner,
      persistenceAddress,
      [withdrawMsg],
      PERSISTENCE_FEE,
      "",
      persistenceChainInfo.rpc
    );
    printConsole(transaction, "transaction withdraw");
    yield put(setWithdrawTxnStepNumber(2));
    if (transaction.code === 0) {
      const response: string = yield pollAccountBalance(
        cosmosAddress,
        cosmosChainInfo?.stakeCurrency.coinMinimalDenom!,
        cosmosChainInfo.rpc,
        pollInitialIBCAtomBalance.toString()
      );
      if (response !== "0") {
        yield put(setWithdrawTxnStepNumber(3));
        yield postTransactionActions(
          "withdraw",
          persistenceAddress,
          cosmosAddress,
          persistenceChainInfo,
          cosmosChainInfo
        );
      }
      yield put(resetTransaction());
    } else {
      throw new Error(transaction.rawLog);
    }
  } catch (e: any) {
    yield put(resetTransaction());
    yield put(setWithdrawTxnFailed(true));
    const customScope = new Sentry.Scope();
    customScope.setLevel(FATAL);
    customScope.setTags({
      [ERROR_WHILE_DEPOSITING]: payload.persistenceAddress
    });
    yield postTransactionActions(
      "withdraw",
      persistenceAddress,
      cosmosAddress,
      persistenceChainInfo,
      cosmosChainInfo
    );
    genericErrorHandler(e, customScope);
  }
}

export function* executeDelegationStakeTransaction({
  payload
}: DelegationStakeTransactionPayload): any {
  const {
    srcChainInfo,
    dstChainInfo,
    srcChainSigner,
    account,
    dstAddress,
    msg,
    dstChainSigner,
    pollInitialBalance,
    initialCosmosBalance,
    initialPersistenceBalance
  } = payload;
  try {
    let ibcInfo = IBCChainInfos[env].find(
      (chain) => chain.counterpartyChainId === dstChainInfo.chainId
    );
    yield put(setStakeTxnStepNumber(1));
    // step 1: fetch initial balance on destination chain
    // @ts-ignore
    const balances = initialCosmosBalance;
    const balancesOnPersistence = initialPersistenceBalance;
    console.log(balances, "balance response1", msg);
    // step 2: make tokenize txn
    const transaction: DeliverTxResponse = yield Transaction(
      dstChainSigner, // dstChainSigner,
      dstAddress, // dstAddress,
      msg,
      COSMOS_FEE, // getGasPrice(dstChainInfo.stakeCurrency.coinMinimalDenom),
      "",
      dstChainInfo.rpc // dstChainInfo.rpc
    );
    printConsole(transaction, "transaction tokenize");
    yield put(setDepositAmount(""));
    if (transaction.code === 0) {
      // step 3: polling to check tokenize txn status
      const response: any = yield pollAccountBalanceList(
        balances,
        dstAddress,
        dstChainInfo.rpc
      );
      yield put(setStakeTxnStepNumber(2));
      console.log(response, "transaction poll response", msg);
      if (response.length > 0) {
        let newList: any = [];
        msg.forEach((msgItem) => {
          // filter balance list based on selected list
          const filtered = response.filter((item: any) =>
            item.denom.includes(msgItem!.value!.validatorAddress)
          );
          // get the max index from tokenized delegations
          const maxObject = Math.max(
            ...filtered.map((o: any) => {
              const value = o.denom.substring(
                o.denom.indexOf("/") + 1,
                o.denom.length + 1
              );
              return Number(value);
            })
          );
          // get the selected validator amount balance list using index
          const selectedValidator = filtered.find(
            (item: any) =>
              item.denom === `${msgItem!.value!.validatorAddress}/${maxObject}`
          );
          console.log(maxObject, "maxObject", selectedValidator);
          newList.push(selectedValidator ? selectedValidator : filtered);
        });
        let ibcMessages = [];
        for (let item of newList) {
          if (item.denom.startsWith(ibcInfo!.prefix)) {
            const ibcMsg = yield MakeIBCTransferMsg({
              channel: ibcInfo!.sourceChannelId, // ibcInfo?.sourceChannelId,
              fromAddress: dstAddress, //dstAddress,
              toAddress: account, // account,
              amount: item.amount,
              timeoutHeight: undefined,
              timeoutTimestamp: undefined,
              denom: item.denom,
              sourceRPCUrl: dstChainInfo.rpc, // dstChainInfo?.rpc,
              destinationRPCUrl: srcChainInfo?.rpc, // srcChainInfo?.rpc,
              port: IBCConfiguration.ibcDefaultPort
            });
            ibcMessages.push(ibcMsg);
          }
        }
        printConsole(ibcMessages, "transaction ibcMsg");
        // step 4: make ibc txn to transfer tokenized tokens
        const ibcTxn: DeliverTxResponse = yield Transaction(
          dstChainSigner, // dstChainSigner,
          dstAddress, //dstAddress,
          ibcMessages,
          COSMOS_FEE, // getGasPrice(dstChainInfo.stakeCurrency.coinMinimalDenom),
          "",
          dstChainInfo.rpc // dstChainInfo.rpc
        );
        printConsole(ibcTxn, "transaction ibcTxn");
        if (ibcTxn.code === 0) {
          // step 5: polling to check ibc txn status
          const pollIbcTxn: any = yield pollAccountBalanceList(
            balancesOnPersistence,
            account, // dstAddress,
            srcChainInfo.rpc //dstChainInfo.rpc
          );
          yield put(setStakeTxnStepNumber(3));
          console.log(
            pollIbcTxn,
            "transaction ibcTxn polling",
            balancesOnPersistence
          );
          if (pollIbcTxn.length > 0) {
            console.log("successfully transferred");
            yield put(setStakeTxnStepNumber(4));
            // fetch balance source chain
            const srcBalances: QueryAllBalancesResponse =
              yield fetchAccountBalance(
                account, //srcAddress,
                srcChainInfo.rpc // srcChainInfo.rpc
              );
            console.log("srcBalances", srcBalances);
            const tokens: any = yield getTokenizedSharesFromBalance(
              srcBalances,
              account, //account
              srcChainInfo.rpc, // srcChainInfo.rpc
              ibcInfo!.prefix
            );
            console.log("tokens", tokens);
            let liquidStakeMsg: any = [];
            msg.forEach((msgItem) => {
              tokens.forEach((item: any) => {
                if (item.baseDenom.includes(msgItem!.value!.validatorAddress)) {
                  liquidStakeMsg.push(
                    LiquidStakeLsmMsg(account, item.amount, item.denom)
                  );
                }
              });
            });
            // const liquidStakeMsg = LiquidStakeLsmMsg(account, delegations);
            console.log(liquidStakeMsg, "liquidStakeMsg");
            // step 6: make liquid stake txn with received tokenized tokens on src chain
            const liquidStakeTxn: DeliverTxResponse = yield Transaction(
              srcChainSigner,
              account,
              liquidStakeMsg,
              PERSISTENCE_FEE,
              "",
              srcChainInfo.rpc
            );
            console.log(liquidStakeTxn, "liquidStakeTxn");
            if (liquidStakeTxn.code === 0) {
              // step 7:  polling to check liquidStake txn status
              yield put(setStakeTxnStepNumber(5));
              yield postTransactionActions(
                "delegationStaking",
                account,
                dstAddress,
                srcChainInfo,
                dstChainInfo
              );
            } else {
              throw new Error("some thing went wrong");
            }
          } else {
            throw new Error("some thing went wrong");
          }
        } else {
          throw new Error("some thing went wrong");
        }
      } else {
        throw new Error("some thing went wrong");
      }
    } else {
      throw new Error(transaction.rawLog);
    }
  } catch (e: any) {
    console.log(e, "-cosmos error in executeLSMTransaction");
    yield put(setStakeTxnFailed(true));
    const customScope = new Sentry.Scope();
    customScope.setLevel(FATAL);
    customScope.setTags({
      [ERROR_WHILE_STAKING]: payload.account
    });
    yield postTransactionActions(
      "delegationStaking",
      account,
      dstAddress,
      srcChainInfo,
      dstChainInfo
    );
    genericErrorHandler(e, customScope);
  }
}

export function* executeTokenizedShareStakeTransaction({
  payload
}: TokenizedShareStakeTransactionPayload): any {
  const {
    srcChainInfo,
    dstChainInfo,
    srcChainSigner,
    account,
    dstAddress,
    tokenList,
    dstChainSigner,
    pollInitialBalance
  } = payload;
  try {
    console.log(tokenList, "tokenList-tr");
    yield put(setStakeTxnStepNumber(1));

    let ibcInfo = IBCChainInfos[env].find(
      (chain) => chain.counterpartyChainId === dstChainInfo.chainId
    );
    // step 1: fetch initial balance on destination chain
    // @ts-ignore
    const balances: any = yield fetchAccountBalance(
      dstAddress,
      dstChainInfo!.rpc
    );
    const balancesOnPersistence: any = yield fetchAccountBalance(
      account,
      srcChainInfo!.rpc
    );
    yield put(setStakeTxnStepNumber(2));

    if (tokenList.sharesOnDestinationChain.list.length > 0) {
      let newList = tokenList.sharesOnDestinationChain.list;
      let ibcMessages = [];
      for (let item of newList) {
        if (item.denom.startsWith(ibcInfo!.prefix)) {
          const ibcMsg = yield MakeIBCTransferMsg({
            channel: ibcInfo!.sourceChannelId, // ibcInfo?.sourceChannelId,
            fromAddress: dstAddress, //dstAddress,
            toAddress: account, // account,
            amount: item.amount,
            timeoutHeight: undefined,
            timeoutTimestamp: undefined,
            denom: item.denom,
            sourceRPCUrl: dstChainInfo.rpc, // dstChainInfo?.rpc,
            destinationRPCUrl: srcChainInfo?.rpc, // srcChainInfo?.rpc,
            port: IBCConfiguration.ibcDefaultPort
          });
          ibcMessages.push(ibcMsg);
        }
      }
      printConsole(ibcMessages, "transaction ibcMsg");
      // step 4: make ibc txn to transfer tokenized tokens
      const ibcTxn: DeliverTxResponse = yield Transaction(
        dstChainSigner, // dstChainSigner,
        dstAddress, //dstAddress,
        ibcMessages,
        COSMOS_FEE, // getGasPrice(dstChainInfo.stakeCurrency.coinMinimalDenom),
        "",
        dstChainInfo.rpc // dstChainInfo.rpc
      );

      console.log(ibcTxn, "ibcTxn");
      if (ibcTxn.code === 0) {
        // step 5: polling to check ibc txn status
        const pollIbcTxn: any = yield pollAccountBalanceList(
          balancesOnPersistence,
          account, // dstAddress,
          srcChainInfo.rpc //dstChainInfo.rpc
        );
        if (pollIbcTxn.length <= 0) {
          throw new Error("some thing went wrong");
        }
      } else {
        throw new Error("some thing went wrong");
      }
    }
    console.log(balances, "balance response1", tokenList);
    yield put(setStakeTxnStepNumber(3));
    console.log("successfully transferred");
    yield put(setStakeTxnStepNumber(4));
    // fetch balance source chain
    const srcBalances: QueryAllBalancesResponse = yield fetchAccountBalance(
      account, //srcAddress,
      srcChainInfo.rpc // srcChainInfo.rpc
    );
    console.log("srcBalances", srcBalances);
    const tokens: any = yield getTokenizedSharesFromBalance(
      srcBalances,
      account, //account
      srcChainInfo.rpc, // srcChainInfo.rpc
      ibcInfo!.prefix
    );
    console.log("tokens", tokens);
    let liquidStakeMsg: any = [];
    tokens.forEach((item: any) => {
      if (
        item.baseDenom.startsWith("cosmos") &&
        Number(decimalize(item.amount)) >= MIN_STAKE
      ) {
        console.log("tokens-inside", item);
        liquidStakeMsg.push(
          LiquidStakeLsmMsg(account, item.amount, item.denom)
        );
      }
    });
    // const liquidStakeMsg = LiquidStakeLsmMsg(account, delegations);
    console.log(liquidStakeMsg, "liquidStakeMsg");
    // step 6: make liquid stake txn with received tokenized tokens on src chain
    const liquidStakeTxn: DeliverTxResponse = yield Transaction(
      srcChainSigner,
      account,
      liquidStakeMsg,
      PERSISTENCE_FEE,
      "",
      srcChainInfo.rpc
    );
    console.log(liquidStakeTxn, "liquidStakeTxn");
    if (liquidStakeTxn.code === 0) {
      yield put(setStakeTxnStepNumber(5));
      yield postTransactionActions(
        "tokenizedSharesStaking",
        account,
        dstAddress,
        srcChainInfo,
        dstChainInfo
      );
    } else {
      throw new Error("some thing went wrong");
    }
  } catch (e: any) {
    console.log(e, "-cosmos error in executeLSMTransaction");
    yield put(setStakeTxnFailed(true));
    const customScope = new Sentry.Scope();
    customScope.setLevel(FATAL);
    customScope.setTags({
      [ERROR_WHILE_STAKING]: payload.account
    });
    yield postTransactionActions(
      "delegationStaking",
      account,
      dstAddress,
      srcChainInfo,
      dstChainInfo
    );
    genericErrorHandler(e, customScope);
  }
}
