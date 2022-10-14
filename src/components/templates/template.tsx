import Head from "next/head";
import React from "react";
import Sidebar from "../organisms/sidebar";
import Topbar from "../organisms/navigationBar";
import MobileSideBar from "../organisms/sidebar/mobileSidebar";
import ClaimModal from "../organisms/staking/claim";
import StakeModal from "../organisms/staking/stake/stakeModal";

export const PageTemplate = ({children, className, title }: { children: React.ReactNode, className: string, title:string }) => {

  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="appLayout grid gap-6 md:block">
        <div className="md:hidden">
          <Sidebar />
        </div>
        <MobileSideBar/>
        <div className={`mainContainer h-screen overflow-auto bg-no-repeat ` + className}>
          <Topbar/>
          {children}
        </div>
      </div>
        <ClaimModal/>
        <StakeModal/>
    </div>
  )
}

