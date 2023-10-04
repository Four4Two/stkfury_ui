import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useState
} from "react";
import { WalletProviderProps, WalletState, walletType } from "./types";
import { ChainInfo, Window as KeplrWindow } from "@keplr-wallet/types";
import { AccountData } from "@cosmjs/launchpad/build/signer";
import { OfflineSigner } from "@cosmjs/launchpad";
import WalletHandler from "../../helpers/wallets";
import { fetchBalanceSaga } from "../../store/reducers/balances";
import { useDispatch } from "react-redux";
import {
  fetchInitSaga,
  fetchValidatorsSaga,
  setAPY
} from "../../store/reducers/initialData";
import { fetchPendingClaimsSaga } from "../../store/reducers/claim";
import useLocalStorage from "../../customHooks/useLocalStorage";
import { OfflineDirectSigner } from "@cosmjs/proto-signing";
import { displayToast } from "../../components/molecules/toast";
import { ToastType } from "../../components/molecules/toast/types";
import {
  fetchLiveDataSaga,
  setPersistenceChainStatus
} from "../../store/reducers/liveData";
import { getChainStatus } from "../../pages/api/onChain";
import { getStkFuryAPY } from "../../pages/api/externalAPIs";

declare global {
  interface Window extends KeplrWindow {}
}

const WalletContext = createContext<WalletState>({
  furyAccountData: null,
  persistenceAccountData: null,
  furyChainData: null,
  persistenceChainData: null,
  persistenceSigner: null,
  furySigner: null,
  connect(): Promise<boolean> {
    return Promise.resolve(false);
  },
  isWalletConnected: false,
  walletType: "keplr"
});

export const useWallet = (): WalletState => {
  return useContext(WalletContext);
};

export const WalletProvider: FC<WalletProviderProps> = ({
  children,
  furyChainInfo,
  persistenceChainInfo
}) => {
  const [furyChainData, setCosmosChainData] = useState<ChainInfo | null>(
    null
  );
  const [persistenceChainData, setPersistenceChainData] =
    useState<ChainInfo | null>(null);
  const [furySigner, setCosmosSigner] = useState<
    OfflineSigner | OfflineDirectSigner | null
  >(null);
  const [persistenceSigner, setPersistenceSigner] = useState<
    OfflineSigner | OfflineDirectSigner | null
  >(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletType, setWalletType] = useState<walletType>("keplr");
  const [persistenceAccountData, setPersistenceAccountData] =
    useState<AccountData | null>(null);
  const [furyAccountData, setCosmosAccountData] =
    useState<AccountData | null>(null);
  const [walletConnected, setWalletConnected] = useLocalStorage("wallet", "");
  const [walletName, setWalletName] = useLocalStorage("walletName", "");

  const dispatch = useDispatch();

  // re-login on every reload or refresh
  useEffect(() => {
    if (walletConnected) {
      if (walletName === "keplr") {
        connect("keplr");
      } else if (walletName === "leap") {
        connect("leap");
      } else {
        connect("cosmosStation");
      }
    }
  }, [walletConnected, walletName]);

  // fetch calls on initial render
  useEffect(() => {
    dispatch(
      fetchInitSaga({
        persistenceChainInfo: persistenceChainInfo!,
        furyChainInfo: furyChainInfo!
      })
    );
    dispatch(
      fetchValidatorsSaga({
        rpc: persistenceChainInfo.rpc!,
        chainID: furyChainInfo.chainId
      })
    );
    dispatch(
      fetchLiveDataSaga({
        persistenceChainInfo: persistenceChainInfo!,
        furyChainInfo: furyChainInfo!
      })
    );
  }, [persistenceChainInfo, dispatch, furyChainInfo]);

  // fetch calls only on initial render
  useEffect(() => {
    const fetchApy = async () => {
      const [persistenceChainStatus] = await Promise.all([
        getChainStatus(persistenceChainInfo.rpc)
      ]);
      const apy = await getStkFuryAPY();
      dispatch(setAPY(apy));
      dispatch(setPersistenceChainStatus(persistenceChainStatus));
    };
    fetchApy();
  }, []);

  useEffect(() => {
    setCosmosChainData(furyChainInfo);
    setPersistenceChainData(persistenceChainInfo);
  }, [furyChainInfo, persistenceChainInfo]);

  const connect = async (walletType: walletType): Promise<boolean> => {
    try {
      let persistenceSignerData: any = await WalletHandler(
        persistenceChainInfo,
        walletType
      );

      let furySignerData: any = await WalletHandler(
        furyChainInfo,
        walletType
      );

      let persistenceAddressData: any =
        await persistenceSignerData!.getAccounts();
      let furyAddressData: any = await furySignerData!.getAccounts();

      setCosmosAccountData(furyAddressData[0]);
      setCosmosSigner(furySignerData);
      setPersistenceAccountData(persistenceAddressData[0]);
      setPersistenceSigner(persistenceSignerData);

      dispatch(
        fetchBalanceSaga({
          persistenceAddress: persistenceAddressData[0]!.address,
          furyAddress: furyAddressData[0]!.address,
          persistenceChainInfo: persistenceChainInfo!,
          furyChainInfo: furyChainInfo!
        })
      );
      dispatch(
        fetchPendingClaimsSaga({
          address: persistenceAddressData[0]!.address,
          persistenceChainInfo: persistenceChainInfo!,
          dstChainInfo: furyChainInfo
        })
      );
      setWalletName(walletType);
      setWalletConnected("connected");
      setWalletType(walletType);
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
    furyAccountData,
    furySigner,
    furyChainData,
    persistenceAccountData,
    persistenceSigner,
    persistenceChainData,
    connect,
    isWalletConnected,
    walletType
  };

  return (
    <WalletContext.Provider value={walletState}>
      {children}
    </WalletContext.Provider>
  );
};

export default WalletProvider;
