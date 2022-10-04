import Head from "next/head";
import React from "react";
import Sidebar from "../organisms/sidebar";
import Topbar from "../organisms/navigationBar";
import MobileSideBar from "../organisms/sidebar/mobileSidebar";
import Deposit from "../organisms/deposit";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

export const PageTemplate = ({children, className}: { children: React.ReactNode, className: string }) => {

    Sentry.init({
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

        integrations: [new Integrations.BrowserTracing()],

        tracesSampleRate: 1.0, //lower the value in production

    });

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

