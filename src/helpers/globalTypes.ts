import {ReactNode} from "react";
import {AxiosRequestConfig} from "axios";
import {AppCurrency, Currency, FeeCurrency} from "@keplr-wallet/types/build/currency";
import {BIP44} from "@keplr-wallet/types/build/bip44";

export type CollateralAsset = "XPRT" | "OSMO" | "ATOM"
export type BorrowableAsset = "USDC"
export type Asset = CollateralAsset | BorrowableAsset



export interface ReactChildrenProp {
    children: ReactNode
}