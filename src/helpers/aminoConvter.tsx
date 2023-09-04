import {
  MsgLiquidStake,
  MsgLiquidUnstake,
  MsgRedeem
} from "persistenceonejs/pstake/liquidstakeibc/v1beta1/msgs";
import { AminoMsg, Coin } from "@cosmjs/amino";
import { AminoConverters } from "@cosmjs/stargate";
import {
  COSMOS_LIQUID_STAKE_URL,
  COSMOS_LIQUID_UN_STAKE_URL,
  REDEEM_URL
} from "../../AppConstants";

export interface AminoMsgLiquidStake extends AminoMsg {
  readonly type: "cosmos/MsgLiquidStake";
  readonly value: {
    readonly delegator_address: string;
    readonly amount?: Coin;
  };
}

export interface AminoMsgLiquidUnStake extends AminoMsg {
  readonly type: "cosmos/MsgLiquidUnstake";
  readonly value: {
    readonly delegator_address: string;
    readonly amount?: Coin;
  };
}

export interface AminoMsgClaim extends AminoMsg {
  readonly type: "cosmos/MsgClaim";
  readonly value: {
    readonly delegator_address: string;
  };
}

export interface AminoMsgRedeem extends AminoMsg {
  readonly type: "cosmos/MsgRedeem";
  readonly value: {
    readonly delegator_address: string;
    readonly amount?: Coin;
  };
}

export function createLSIBCosmosAminoConverters(): AminoConverters {
  return {
    [COSMOS_LIQUID_STAKE_URL]: {
      aminoType: "cosmos/MsgLiquidStake",
      toAmino: ({
        delegatorAddress,
        amount
      }: MsgLiquidStake): AminoMsgLiquidStake["value"] => ({
        delegator_address: delegatorAddress,
        amount: amount
      }),
      fromAmino: ({
        delegator_address,
        amount
      }: AminoMsgLiquidStake["value"]): MsgLiquidStake => ({
        delegatorAddress: delegator_address,
        amount: amount
      })
    },
    [COSMOS_LIQUID_UN_STAKE_URL]: {
      aminoType: "cosmos/MsgLiquidUnstake",
      toAmino: ({
        delegatorAddress,
        amount
      }: MsgLiquidUnstake): AminoMsgLiquidUnStake["value"] => ({
        delegator_address: delegatorAddress,
        amount: amount
      }),
      fromAmino: ({
        delegator_address,
        amount
      }: AminoMsgLiquidUnStake["value"]): MsgLiquidUnstake => ({
        delegatorAddress: delegator_address,
        amount: amount
      })
    },
    [REDEEM_URL]: {
      aminoType: "cosmos/MsgRedeem",
      toAmino: ({
        delegatorAddress,
        amount
      }: MsgRedeem): AminoMsgRedeem["value"] => ({
        delegator_address: delegatorAddress,
        amount: amount
      }),
      fromAmino: ({
        delegator_address,
        amount
      }: AminoMsgRedeem["value"]): MsgRedeem => ({
        delegatorAddress: delegator_address,
        amount: amount
      })
    }
  };
}
