import Head from "next/head";
import React from "react";
import Topbar from "../organisms/navigationBar";
import MobileSideBar from "../organisms/sidebar/mobileSidebar";
import ClaimModal from "../organisms/staking/claim";
import StakeModal from "../organisms/staking/stake/stakeModal";
import WithdrawModal from "../organisms/sidebar/withdrawModal";
import StakeToasts from "../organisms/staking/stake/stakeToasts";
import { useSelector } from "react-redux";
import { RootState } from "../../store/reducers";
import ValidatorStakeModal from "../organisms/staking/stake/validator-stake-modal";
import TokenizedSharesModal from "../organisms/staking/stake/validator-stake-modal/tokenized-modal/tokenized-shares";

export const PageTemplate = ({
  children,
  className,
  title
}: {
  children: React.ReactNode;
  className: string;
  title: string;
}) => {
  const { showModal, validatorModal, tokenizedModal } = useSelector(
    (state: RootState) => state.stake
  );
  return (
    <div>
      <div className="appLayout grid md:block">
        <MobileSideBar />
        <div
          className={
            `mainContainer h-screen overflow-auto bg-no-repeat ` + className
          }
        >
          <Topbar />
          {children}
        </div>
      </div>
      <ClaimModal />
      <StakeModal />
      <WithdrawModal />
      {validatorModal ? <ValidatorStakeModal /> : null}
      {tokenizedModal ? <TokenizedSharesModal /> : null}
      {!showModal ? <StakeToasts /> : null}
    </div>
  );
};
