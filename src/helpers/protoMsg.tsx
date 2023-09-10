import {
  COSMOS_LIQUID_STAKE_LSM_URL,
  COSMOS_LIQUID_STAKE_URL,
  COSMOS_LIQUID_UN_STAKE_URL,
  IBC_TRANSFER_URL,
  msgValidatorBondUrl,
  REDEEM_URL,
  TOKENIZE_URL
} from "../../AppConstants";
import {
  MsgLiquidStake,
  MsgLiquidStakeLSM,
  MsgLiquidUnstake,
  MsgRedeem
} from "persistenceonejs/pstake/liquidstakeibc/v1beta1/msgs";

import { MsgTransfer } from "cosmjs-types/ibc/applications/transfer/v1/tx";
import { coin } from "@cosmjs/amino";
import Long from "long";
import {
  MsgTokenizeShares,
  MsgValidatorBond
} from "persistenceonejs/cosmos/staking/v1beta1/tx";
import { amountDecimalize } from "./utils";

export interface LiquidStakeMsgTypes {
  typeUrl?: string;
  value?: MsgLiquidStake;
}

export interface TransferMsgTypes {
  typeUrl?: string;
  value?: MsgTransfer;
}

export interface LiquidUnStakeMsgTypes {
  typeUrl?: string;
  value?: MsgLiquidStake;
}

export interface RedeemMsgTypes {
  typeUrl?: string;
  value?: MsgRedeem;
}

export interface TokenizeShareMsgTypes {
  typeUrl?: string;
  value?: MsgTokenizeShares;
}

export interface LiquidStakeLsmMsgTypes {
  typeUrl?: string;
  value?: MsgLiquidStakeLSM;
}

export const LiquidStakeMsg = (
  address: string,
  amount: string,
  denom: string
): LiquidStakeMsgTypes => {
  return {
    typeUrl: COSMOS_LIQUID_STAKE_URL,
    value: MsgLiquidStake.fromPartial({
      delegatorAddress: address,
      amount: {
        denom: denom,
        amount: String(amount)
      }
    })
  };
};

export const LiquidUnStakeMsg = (
  address: string,
  amount: string,
  denom: string
): LiquidUnStakeMsgTypes => {
  return {
    typeUrl: COSMOS_LIQUID_UN_STAKE_URL,
    value: MsgLiquidUnstake.fromPartial({
      delegatorAddress: address,
      amount: {
        denom: denom,
        amount: String(amount)
      }
    })
  };
};

export const RedeemMsg = (
  address: string,
  amount: string,
  denom: string
): RedeemMsgTypes => {
  return {
    typeUrl: REDEEM_URL,
    value: MsgRedeem.fromPartial({
      delegatorAddress: address,
      amount: {
        denom: denom,
        amount: String(amount)
      }
    })
  };
};

export const TransferMsg = (
  channel: string,
  fromAddress: string,
  toAddress: string,
  amount: string,
  timeoutHeight: any,
  timeoutTimestamp: string | number | Long.Long | undefined,
  denom: string,
  port = "transfer"
): TransferMsgTypes => {
  const actualAmount = amountDecimalize(amount);
  console.log(amount, Number(amount), "tr-msg", actualAmount);

  return {
    typeUrl: IBC_TRANSFER_URL,
    value: MsgTransfer.fromPartial({
      sourcePort: port,
      sourceChannel: channel,
      token: {
        denom: denom,
        amount: amount
      },
      // coin(Number(amount).toString(), denom),
      sender: fromAddress,
      receiver: toAddress,
      timeoutHeight: {
        revisionNumber: timeoutHeight?.revisionNumber,
        revisionHeight: timeoutHeight?.revisionHeight
      },
      timeoutTimestamp: timeoutTimestamp
    })
  };
};

export const TokenizeSharesMsg = (
  fromAddress: string,
  validatorAddress: string,
  tokenizedShareOwner: string,
  amount: any,
  denom: string
): TokenizeShareMsgTypes => {
  return {
    typeUrl: TOKENIZE_URL,
    value: MsgTokenizeShares.fromPartial({
      delegatorAddress: fromAddress,
      validatorAddress: validatorAddress,
      amount: {
        denom: denom,
        amount: String(amount)
      },
      tokenizedShareOwner: tokenizedShareOwner
    })
  };
};

export const LiquidStakeLsmMsg = (
  address: string,
  amount: any,
  denom: string
): LiquidStakeLsmMsgTypes => {
  return {
    typeUrl: COSMOS_LIQUID_STAKE_LSM_URL,
    value: MsgLiquidStakeLSM.fromPartial({
      delegatorAddress: address,
      delegations: [
        {
          denom: denom,
          amount: amount
        }
      ]
    })
  };
};

export const ValidatorBond = (
  delegatorAddress: string,
  validatorAddress: string
) => {
  return {
    typeUrl: msgValidatorBondUrl,
    value: MsgValidatorBond.fromPartial({
      delegatorAddress: delegatorAddress,
      validatorAddress: validatorAddress
    })
  };
};
