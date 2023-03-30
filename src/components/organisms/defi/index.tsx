import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import Filters from "./filter";
import { defiSwapList, defiBorrowLendingList } from "./defiData";
import CardList from "./cardList";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/reducers";

const DefiList = () => {
  const [sortActive, setSortActive] = useState<any>({
    all: true,
    dexes: false,
    lending: false
  });

  const [defiData, setDefiData] = useState<any>([]);
  const [lendingData, setLendingData] = useState<any>([]);
  const [allData, setAllData] = useState<any>([]);

  const initData = useSelector((state: RootState) => state.initialData);

  useEffect(() => {
    const defiList = defiSwapList(
      initData.osmosisInfo,
      initData.crescentInfo,
      initData.dexterInfo
    );
    setDefiData(defiList);
    setLendingData(defiBorrowLendingList);
    const totalData: any = [
      ...defiSwapList(
        initData.osmosisInfo,
        initData.crescentInfo,
        initData.dexterInfo
      ),
      ...defiBorrowLendingList
    ];
    const sortedData = totalData.sort((a: any, b: any) => a.id - b.id);
    setAllData(sortedData);
  }, [initData.osmosisInfo, initData.crescentInfo, initData.dexterInfo]);

  const searchHandler = (evt: any) => {
    const searchTerm = evt.target.value;
    let newDefiList;
    let newLendingList;

    newDefiList = defiSwapList(
      initData.osmosisInfo,
      initData.crescentInfo,
      initData.dexterInfo
    ).filter((val) => {
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
          Put your stkATOM to work in the Cosmos DeFi Ecosystem with additional
          <br />
          yield while still earning ATOM staking rewards
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
