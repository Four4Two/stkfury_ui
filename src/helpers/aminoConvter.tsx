import {
  MsgLiquidStake,
  MsgLiquidStakeLSM,
  MsgLiquidUnstake,
  MsgRedeem
} from "persistenceonejs/pstake/liquidstakeibc/v1beta1/msgs";
import { AminoMsg, Coin } from "@cosmjs/amino";
import { AminoConverters } from "@cosmjs/stargate";
import {
  COSMOS_LIQUID_STAKE_LSM_URL,
  COSMOS_LIQUID_STAKE_URL,
  COSMOS_LIQUID_UN_STAKE_URL,
  REDEEM_URL,
  TOKENIZE_URL
} from "../../AppConstants";
import { MsgTokenizeShares } from "persistenceonejs/cosmos/staking/v1beta1/tx";

export interface TokenizeShareMsgTypes {
  typeUrl?: string;
  value?: MsgTokenizeShares;
}

export interface LiquidStakeLsmMsgTypes {
  typeUrl?: string;
  value?: MsgLiquidStakeLSM;
}

export interface AminoMsgLiquidStake extends AminoMsg {
  readonly type: "pstake/MsgLiquidStake";
  readonly value: {
    readonly delegator_address: string;
    readonly amount?: Coin;
  };
}

export interface AminoMsgLiquidUnStake extends AminoMsg {
  readonly type: "pstake/MsgLiquidUnstake";
  readonly value: {
    readonly delegator_address: string;
    readonly amount?: Coin;
  };
}

export interface AminoMsgRedeem extends AminoMsg {
  readonly type: "pstake/MsgRedeem";
  readonly value: {
    readonly delegator_address: string;
    readonly amount?: Coin;
  };
}

export interface AminoMsgLiquidStakeLSM extends AminoMsg {
  readonly type: "pstake/MsgLiquidStakeLSM";
  readonly value: {
    readonly delegator_address: string;
    readonly delegations?: Coin[];
  };
}
export interface AminoMsgTokenizeShares extends AminoMsg {
  readonly type: "cosmos-sdk/MsgTokenizeShares";
  readonly value: {
    readonly delegator_address: string;
    readonly validator_address: string;
    readonly amount?: Coin;
    readonly tokenized_share_owner: string;
  };
}

export function createLSIBCosmosAminoConverters(): AminoConverters {
  return {
    [COSMOS_LIQUID_STAKE_LSM_URL]: {
      aminoType: "pstake/MsgLiquidStakeLSM",
      toAmino: ({
        delegatorAddress,
        delegations
      }: MsgLiquidStakeLSM): AminoMsgLiquidStakeLSM["value"] => ({
        delegator_address: delegatorAddress,
        delegations: delegations
      }),
      fromAmino: ({
        delegator_address,
        delegations
      }: AminoMsgLiquidStakeLSM["value"]): MsgLiquidStakeLSM => ({
        delegatorAddress: delegator_address,
        delegations: delegations!
      })
    },
    [TOKENIZE_URL]: {
      aminoType: "cosmos-sdk/MsgTokenizeShares",
      toAmino: ({
        delegatorAddress,
        validatorAddress,
        amount,
        tokenizedShareOwner
      }: MsgTokenizeShares): AminoMsgTokenizeShares["value"] => ({
        delegator_address: delegatorAddress,
        validator_address: validatorAddress,
        tokenized_share_owner: tokenizedShareOwner,
        amount: amount
      }),
      fromAmino: ({
        delegator_address,
        validator_address,
        tokenized_share_owner,
        amount
      }: AminoMsgTokenizeShares["value"]): MsgTokenizeShares => ({
        delegatorAddress: delegator_address,
        validatorAddress: validator_address!,
        tokenizedShareOwner: tokenized_share_owner,
        amount: amount!
      })
    },
    [COSMOS_LIQUID_STAKE_URL]: {
      aminoType: "pstake/MsgLiquidStake",
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
        amount: amount!
      })
    },
    [COSMOS_LIQUID_UN_STAKE_URL]: {
      aminoType: "pstake/MsgLiquidUnstake",
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
        amount: amount!
      })
    },
    [REDEEM_URL]: {
      aminoType: "pstake/MsgRedeem",
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
        amount: amount!
      })
    }
  };
}
