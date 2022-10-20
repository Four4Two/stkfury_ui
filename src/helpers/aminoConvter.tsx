import {MsgLiquidStake} from "./proto-codecs/codec/pstake/pstake/lscosmos/v1beta1/msgs";
import {AminoMsg, Coin} from "@cosmjs/amino";
import {AminoConverters} from "@cosmjs/stargate";

export interface AminoMsgLiquidStake extends AminoMsg {
    readonly type: "cosmos/MsgLiquidStake";
    readonly value: {
        readonly delegator_address: string;
        readonly amount?: Coin;
    };
}


export function isAminoMsgLiquidStake(msg: AminoMsg): msg is AminoMsgLiquidStake {
    return msg.type === "cosmos/MsgLiquidStake";
}

export function createLSCosmosAminoConverters(): AminoConverters {
    return {
        "/pstake.lscosmos.v1beta1.MsgLiquidStake": {
            aminoType: "cosmos/MsgLiquidStake",
            toAmino: ({delegatorAddress, amount}: MsgLiquidStake): AminoMsgLiquidStake["value"] => ({
                delegator_address: delegatorAddress,
                amount: amount,
            }),
            fromAmino: ({delegator_address, amount}: AminoMsgLiquidStake["value"]): MsgLiquidStake => ({
                delegatorAddress: delegator_address,
                amount: amount,
            }),
        },
    }
}