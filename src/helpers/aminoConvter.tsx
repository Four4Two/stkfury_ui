import {Coin} from "@cosmjs/proto-signing";
import {MsgLiquidStake} from "./proto-codecs/codec/pstake/pstake/lscosmos/v1beta1/msgs";
import {AminoMsg} from "@cosmjs/amino";

export interface AminoMsgSend extends AminoMsg {
    readonly type: "cosmos/MsgLiquidStake";
    readonly value: {
        readonly delegator_address: string;
        readonly amount: Coin;
    };
}

export const customAminoTypes = {
    "/pstake.lscosmos.v1beta1.MsgLiquidStake": {
        aminoType: "cosmos/MsgLiquidStake",
        toAmino:({delegatorAddress, amount}: MsgLiquidStake) => {
            return {
                delegator_address: delegatorAddress,
                amount
            };
        },
        fromAmino: ({delegator_address, amount}: AminoMsgSend["value"]) => {
            return {
                delegatorAddress: delegator_address,
                amount
            };
        },
    }
}