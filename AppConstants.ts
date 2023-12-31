export const PERSISTENCE_CHAIN_ID = "pstaked-1";
export const COSMOS_CHAIN_ID = "gaiad-1";
export const TEST_NET = "Testnet";
export const DEV_NET = "Devnet";
export const DEPOSIT_ADDRESS = "fury154f55zvupfknzweveltcramsccrctg7ey9auv7";
export const PERSISTENCE_FEE = "0uxprt";
export const COSMOS_FEE = "0.0025ufury";
export const COSMOS_LIQUID_STAKE_URL =
  "/pstake.liquidstakeibc.v1beta1.MsgLiquidStake";
export const COSMOS_LIQUID_UN_STAKE_URL =
  "/pstake.liquidstakeibc.v1beta1.MsgLiquidUnstake";
export const REDEEM_URL = "/pstake.liquidstakeibc.v1beta1.MsgRedeem";
export const IBC_TRANSFER_URL = "/ibc.applications.transfer.v1.MsgTransfer";
export const msgValidatorBondUrl = "/cosmos.staking.v1beta1.MsgValidatorBond";
export const TOKENIZE_URL = "/cosmos.staking.v1beta1.MsgTokenizeShares";
export const COSMOS_LIQUID_STAKE_LSM_URL =
  "/pstake.liquidstakeibc.v1beta1.MsgLiquidStakeLSM";

export const SHORT_INTERVAL = 10000;
export const MIN_BALANCE_CHECK = 0.00003;
export const MIN_DEPOSIT = 0.01;
export const MIN_STAKE = 0.01;
export const MIN_STAKE_FEE = 0.01;
export const MIN_REDEEM = 0.01;
export const BUG_REPORT_URL =
  "https://docs.google.com/forms/d/1SpwpntQ5jVAb5BwtG7-Ul58z0vE7RocCSrN-s6bCl8M/viewform?edit_requested=true";
export const IBC_DENOM =
  "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2";
export const CRESCENT_STK_FURY_DENOM =
  "ibc/E32F6485CDAE995FC492010770936119D0BF90F5226C9AED727988DF03B5F569";

// Key works
export const COIN_FURY = "FURY";
export const COIN_FURY_DENOM = "ufury";
export const STK_FURY_DENOM = "STKFURY";
export const STK_FURY_MINIMAL_DENOM = "stk/ufury";
export const FURY_BALANCE = "FuryBalance";
export const STK_FURY_BALANCE = "stkFURYBalance";
export const COSMOS_FURY_BALANCE = "CosmosFuryBalance";
export const COIN_GRAVITY_DENOM = "ugraviton";
export const KEPLR = "keplr";
export const LEDGER = "ledger";
export const INSTANT = "instant";
export const STAKE = "stake";
export const UN_STAKE = "unstake";
export const CLAIM = "claim";
export const FATAL = "fatal";
export const DEPOSIT = "deposit";
export const FEES = "fees";
export const POOL_LIQUIDITY = "pool_liquidity";
export const WITHDRAW = "withdraw";
export const GA_TRACKING_ID = "G-2KP73MV1DJ";
export const COSMOS_UNBOND_TIME =
  process.env.NEXT_PUBLIC_ENVIRONMENT !== "Devnet" ? 1814400 : 300;
export const MID_INTERVAL = 180000;

export const LONG_INTERVAL = 3600000;

export const APR_BASE_RATE = 18.92;
export const APR_DEFAULT = 19.08;

//error msgs
export const ERROR_WHILE_CLAIMING = "ERROR_WHILE_CLAIMING";
export const ERROR_WHILE_STAKING = "ERROR_WHILE_STAKING";
export const ERROR_WHILE_DEPOSITING = "ERROR_WHILE_DEPOSITING";
export const ERROR_WHILE_UNSTAKING = "ERROR_WHILE_UNSTAKING";
export const EMPTY_POOL_ERROR =
  "Query failed with (6): rpc error: code = Unknown desc = failed to execute message; message index: 0: Delegated amount: 0ufury is less than total undelegations for the epoch:";
