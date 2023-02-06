import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useState
} from "react";
import { WalletProviderProps, WalletState } from "./types";
import { ChainInfo, Window as KeplrWindow } from "@keplr-wallet/types";
import { AccountData } from "@cosmjs/launchpad/build/signer";
import { OfflineSigner } from "@cosmjs/launchpad";
import KeplrWallet from "../../helpers/keplr";
import { fetchBalanceSaga } from "../../store/reducers/balances";
import { useDispatch } from "react-redux";
import { fetchInitSaga, setAPY } from "../../store/reducers/initialData";
import { printConsole } from "../../helpers/utils";
import { fetchPendingClaimsSaga } from "../../store/reducers/claim";
import useLocalStorage from "../../customHooks/useLocalStorage";
import { OfflineDirectSigner } from "@cosmjs/proto-signing";
import { displayToast } from "../../components/molecules/toast";
import { ToastType } from "../../components/molecules/toast/types";
import {
  fetchLiveDataSaga,
  setCosmosChainStatus,
  setPersistenceChainStatus
} from "../../store/reducers/liveData";
import { getAPY, getChainStatus } from "../../pages/api/onChain";
import { put } from "@redux-saga/core/effects";
import CosmosStationWallet from "../../helpers/cosmosStation";

declare global {
  interface Window extends KeplrWindow {}
}

const WalletContext = createContext<WalletState>({
  cosmosAccountData: null,
  persistenceAccountData: null,
  cosmosChainData: null,
  persistenceChainData: null,
  persistenceSigner: null,
  cosmosSigner: null,
  connect(): Promise<boolean> {
    return Promise.resolve(false);
  },
  isWalletConnected: false
});

export const useWallet = (): WalletState => {
  return useContext(WalletContext);
};

export const WalletProvider: FC<WalletProviderProps> = ({
  children,
  cosmosChainInfo,
  persistenceChainInfo
}) => {
  const [cosmosChainData, setCosmosChainData] = useState<ChainInfo | null>(
    null
  );
  const [persistenceChainData, setPersistenceChainData] =
    useState<ChainInfo | null>(null);
  const [cosmosSigner, setCosmosSigner] = useState<
    OfflineSigner | OfflineDirectSigner | null
  >(null);
  const [persistenceSigner, setPersistenceSigner] = useState<
    OfflineSigner | OfflineDirectSigner | null
  >(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [persistenceAccountData, setPersistenceAccountData] =
    useState<AccountData | null>(null);
  const [cosmosAccountData, setCosmosAccountData] =
    useState<AccountData | null>(null);
  const [walletConnected, setWalletConnected] = useLocalStorage("wallet", "");
  const [walletName, setWalletName] = useLocalStorage("walletName", "");

  const dispatch = useDispatch();

  useEffect(() => {
    if (walletConnected) {
      if (walletName === "keplr") {
        connect("keplr");
      } else {
        connect("cosmosStation");
      }
    }
  }, []);

  useEffect(() => {
    dispatch(
      fetchInitSaga({
        persistenceChainInfo: persistenceChainInfo!,
        cosmosChainInfo: cosmosChainInfo!
      })
    );
    dispatch(
      fetchLiveDataSaga({
        persistenceChainInfo: persistenceChainInfo!,
        cosmosChainInfo: cosmosChainInfo!
      })
    );
  }, [persistenceChainInfo, dispatch, cosmosChainInfo]);

  useEffect(() => {
    const fetchApy = async () => {
      const [apy, cosmosChainStatus, persistenceChainStatus] =
        await Promise.all([
          getAPY(),
          getChainStatus(cosmosChainInfo.rpc),
          getChainStatus(persistenceChainInfo.rpc)
        ]);
      dispatch(setAPY(apy));
      dispatch(setCosmosChainStatus(cosmosChainStatus));
      dispatch(setPersistenceChainStatus(persistenceChainStatus));
    };
    fetchApy();
  }, []);

  useEffect(() => {
    setCosmosChainData(cosmosChainInfo);
    setPersistenceChainData(persistenceChainInfo);
  }, [cosmosChainInfo, persistenceChainInfo]);

  const connect = async (walletType: string): Promise<boolean> => {
    try {
      let persistenceSignerData: any =
        walletType === "keplr"
          ? await KeplrWallet(persistenceChainInfo)
          : await CosmosStationWallet(persistenceChainInfo);

      let cosmosSignerData: any =
        walletType === "keplr"
          ? await KeplrWallet(cosmosChainInfo)
          : await CosmosStationWallet(cosmosChainInfo);

      let persistenceAddressData: any =
        await persistenceSignerData!.getAccounts();
      let cosmosAddressData: any = await cosmosSignerData!.getAccounts();

      setCosmosAccountData(cosmosAddressData[0]);
      setCosmosSigner(cosmosSignerData);
      setPersistenceAccountData(persistenceAddressData[0]);
      setPersistenceSigner(persistenceSignerData);

      dispatch(
        fetchBalanceSaga({
          persistenceAddress: persistenceAddressData[0]!.address,
          cosmosAddress: cosmosAddressData[0]!.address,
          persistenceChainInfo: persistenceChainInfo!,
          cosmosChainInfo: cosmosChainInfo!
        })
      );
      dispatch(
        fetchPendingClaimsSaga({
          address: persistenceAddressData[0]!.address,
          persistenceChainInfo: persistenceChainInfo!
        })
      );
      setWalletName(walletType);
      setWalletConnected("connected");
    } catch (e: any) {
      displayToast(
        {
          message: e.message!
        },
        ToastType.ERROR
      );
      if (
        e.message === "Please install cosmostation extension" ||
        e.message === "install keplr extension"
      ) {
        localStorage.removeItem("wallet");
        localStorage.removeItem("walletName");
      }
      return false;
    }
    setIsWalletConnected(true);
    return true;
  };

  const walletState: WalletState = {
    cosmosAccountData,
    cosmosSigner,
    cosmosChainData,
    persistenceAccountData,
    persistenceSigner,
    persistenceChainData,
    connect,
    isWalletConnected
  };

  return (
    <WalletContext.Provider value={walletState}>
      {children}
    </WalletContext.Provider>
  );
};

export default WalletProvider;
