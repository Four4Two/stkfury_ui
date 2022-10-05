import React, {createContext, FC, useContext, useEffect, useState} from "react";
import {WalletProviderProps, WalletState} from "./types";
import { ChainInfo, Window as KeplrWindow } from "@keplr-wallet/types";
import {AccountData} from "@cosmjs/launchpad/build/signer";
import {OfflineSigner} from "@cosmjs/launchpad";
import KeplrWallet from "../../helpers/keplr";
import { fetchBalanceSaga } from "../../store/reducers/balances";
import { useDispatch } from "react-redux";
import { fetchInitSaga } from "../../store/reducers/initialData";
import { printConsole } from "../../helpers/utils";
import {fetchPendingClaimsSaga} from "../../store/reducers/claim";

declare global {
    interface Window extends KeplrWindow {
    }
}

const WalletContext = createContext<WalletState>({
    cosmosAccountData: null,
    persistenceAccountData :null,
    cosmosChainData:null,
    persistenceChainData:null,
    persistenceSigner:null,
    cosmosSigner: null,
    connect(): Promise<boolean> {
        return Promise.resolve(false);
    },
    isWalletConnected: false,
})

export const useWallet = (): WalletState => {
    return useContext(WalletContext);
}

export const WalletProvider: FC<WalletProviderProps> = ({
                                                            children,
                                                            cosmosChainInfo,
                                                            persistenceChainInfo,
                                                        }) => {
    const [cosmosChainData, setCosmosChainData] =  useState<ChainInfo | null>(null);
    const [persistenceChainData, setPersistenceChainData] = useState<ChainInfo | null>(null);
    const [cosmosSigner, setCosmosSigner] = useState<OfflineSigner | null>(null);
    const [persistenceSigner, setPersistenceSigner] = useState<OfflineSigner | null>(null);
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [persistenceAccountData, setPersistenceAccountData] = useState<AccountData | null>(null);
    const [cosmosAccountData, setCosmosAccountData] = useState<AccountData | null>(null);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchInitSaga({ persistenceChainInfo: persistenceChainInfo! }));
    }, [persistenceChainInfo, dispatch]);

    useEffect(() => {
        setCosmosChainData(cosmosChainInfo)
        setPersistenceChainData(persistenceChainInfo)
    }, [cosmosChainInfo, persistenceChainInfo]);

    const connect = async (): Promise<boolean> => {
        try {
            const persistenceSigner = await KeplrWallet(persistenceChainInfo);
            const cosmosSigner = await KeplrWallet(cosmosChainInfo);
            const cosmosAccounts = await cosmosSigner!.getAccounts();
            setCosmosAccountData(cosmosAccounts[0]);
            setCosmosSigner(cosmosSigner)
            const persistenceAccounts = await persistenceSigner!.getAccounts();
            setPersistenceAccountData(persistenceAccounts[0]);
            setPersistenceSigner(persistenceSigner)
            dispatch(fetchBalanceSaga({
                persistenceAddress:persistenceAccounts[0]!.address,
                cosmosAddress: cosmosAccounts[0]!.address,
                persistenceChainInfo: persistenceChainInfo!,
                cosmosChainInfo: cosmosChainInfo!
            }));
            dispatch(fetchPendingClaimsSaga({
                address:persistenceAccounts[0]!.address,
                persistenceChainInfo: persistenceChainInfo!,
            }));
        } catch (e:any) {
            printConsole(e)
            console.error(e)
            return false
        }
        setIsWalletConnected(true)
        return true
    }

    const walletState: WalletState = {
        cosmosAccountData,
        cosmosSigner,
        cosmosChainData,
        persistenceAccountData,
        persistenceSigner,
        persistenceChainData,
        connect,
        isWalletConnected,
    }

    return (
        <WalletContext.Provider value={walletState}>
            {children}
        </WalletContext.Provider>
    )

}


export default WalletProvider