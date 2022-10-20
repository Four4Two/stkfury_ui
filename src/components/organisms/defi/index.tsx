import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import Filters from "./filter";
import { defiSwapList, defiBorrowLendingList } from "./defiData";
import CardList from "./cardList";

const DefiList = () => {
  const [sortActive, setSortActive] = useState<any>({
    all: true,
    dexes: false,
    lending: false
  });

  const [defiData, setDefiData] = useState<any>([]);
  const [lendingData, setLendingData] = useState<any>([]);
  const [allData, setAllData] = useState<any>([]);

  useEffect(() => {
    setDefiData(defiSwapList);
    setLendingData(defiBorrowLendingList);
    const totalData: any = [...defiSwapList, ...defiBorrowLendingList];
    const sortedData = totalData.sort((a: any, b: any) => a.id - b.id);
    setAllData(sortedData);
  }, []);

  const searchHandler = (evt: any) => {
    const searchTerm = evt.target.value;
    let newDefiList;
    let newLendingList;

    newDefiList = defiSwapList.filter((val) => {
      return (
        val.inputToken.toLowerCase().includes(searchTerm.toLowerCase()) ||
        val.platform.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    newLendingList = defiBorrowLendingList.filter((val) => {
      return (
        val.inputToken.toLowerCase().includes(searchTerm.toLowerCase()) ||
        val.platform.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    const totalData: any = [...newDefiList, ...newLendingList];
    const sortedTotalData = totalData.sort((a: any, b: any) => a.id - b.id);

    setDefiData(newDefiList);
    setLendingData(newLendingList);
    setAllData(sortedTotalData);
  };
  return (
    <div className={`${styles.defiContainer} px-2 pb-10 m-auto md:px-3`}>
      <div className="mb-8">
        <h1 className="text-4xl font-semibold leading-normal text-light-high text-center md:text-lg">
          DeFi
        </h1>
        <h6 className="text-base text-light-high text-center leading-normal md:text-sm">
          Utilise your stkATOM and explore additional yield while still earning
          staking
          <br /> rewards across the COSMOS ecosystem
        </h6>
      </div>
      <Filters
        setSortActive={setSortActive}
        sortActive={sortActive}
        searchHandler={searchHandler}
      />
      <CardList
        sortActive={sortActive}
        allData={allData}
        defiData={defiData}
        lendingData={lendingData}
      />
    </div>
  );
};

export default DefiList;
