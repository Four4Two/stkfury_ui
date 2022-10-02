import Head from "next/head";
import React from "react";
import Sidebar from "../organisms/sidebar";
import Topbar from "../organisms/navigationBar";
import MobileSideBar from "../organisms/sidebar/mobileSidebar";
import Deposit from "../organisms/deposit";

export const PageTemplate = ({children, className}: { children: React.ReactNode, className: string }) => {
  return (
    <div>
      <Head>
        <title>pSTAKE</title>
      </Head>
      <div className="appLayout grid gap-6 md:block">
        <div className="md:hidden">
          <Sidebar />
        </div>
        <MobileSideBar/>
        <div className={`mainContainer overflow-auto bg-no-repeat ` + className}>
          <Topbar/>
          {children}
        </div>
      </div>
      <Deposit />
    </div>
  )
}

