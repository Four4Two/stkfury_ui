import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/reducers";
import {fetchLiveDataSaga, setPersistenceChainStatus} from "../../store/reducers/liveData";
import { BUG_REPORT_URL, SHORT_INTERVAL } from "../../../AppConstants";
import { useWallet } from "../../context/WalletConnect/WalletConnect";
import {getChainStatus} from "../../pages/api/onChain";
import {getStkFuryAPY} from "../../pages/api/externalAPIs";
import {setAPY} from "../../store/reducers/initialData";

const MaintenanceContainer = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { furyChainStatus, persistenceChainStatus } = useSelector(
    (state: RootState) => state.liveData
  );

  const { persistenceChainData } = useWallet();

  useEffect(() => {
    const interval = setInterval(async () => {
      const [persistenceChainStatus] = await Promise.all([
        getChainStatus(persistenceChainData!.rpc)
      ]);
      dispatch(setPersistenceChainStatus(persistenceChainStatus));
    }, SHORT_INTERVAL);
    return () => clearInterval(interval);
  }, [dispatch, persistenceChainData]);

  useEffect(() => {
    if (
      process.env.NEXT_PUBLIC_MAINTENANCE === "false" &&
      router.pathname === "/maintenance" &&
      !furyChainStatus &&
      !persistenceChainStatus
    ) {
      router.push("/");
    }
  }, [router, furyChainStatus, persistenceChainStatus]);

  return (
    <div className="bg-background flex gap-3 justify-center items-center h-screen px-4">
      <div className={"text-center max-w-[616px]"}>
        <img
          src={"/images/caution.svg"}
          alt={"caution"}
          className="m-auto w-[86px] mb-4"
        />
        <p className="font-normal text-sm leading-7 text-light-emphasis mb-4">
         Persistence Core-1 chain is down and under maintenance but will be back online shortly. During this time, transactions will not be processed. We apologize for any inconvenience this may cause and will provide regular updates on our progress. Thank you for your patience
        </p>
        <p className="text-light-emphasis text-base font-semibold leading-normal mb-4">
          — The pSTAKE Team
        </p>
      </div>
    </div>
  );
};

export default MaintenanceContainer;
