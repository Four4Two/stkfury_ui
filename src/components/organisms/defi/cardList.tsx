/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Icon } from "../../atoms/icon";
import ButtonLink from "../../atoms/buttonLink";
import Tooltip from "rc-tooltip";

const listData = (label: any, value: any) => (
  <div className="pr-5 flex-1 md:py-2">
    <p
      className="font-normal text-base
         leading-normal mb-2 text-light-emphasis lg:whitespace-nowrap md:mb-1"
    >
      {label}
    </p>
    <h3 className="font-medium text-base leading-normal text-light-mid whitespace-nowrap flex">
      {value}
    </h3>
  </div>
);

const listShow = (item: any, index: number) => (
  <div className="card-container mb-8" key={index}>
    <div className="card card-primary bg-[#28282880] p-8 rounded-md lg:block flex flex-wrap md:p-5">
      <div className="content flex-1 md:flex-auto">
        <div className="heading-section flex mb-8 md:mb-2 justify-between items-center">
          <div className="heading-section flex">
            <div className="icons relative flex items-center mr-8">
              <span className="z-10 absolute flex">
                <img
                  src={item.inputToken_logo}
                  width={32}
                  height={32}
                  alt={"inputToken_logo"}
                />
              </span>
              <span className="relative left-5 flex">
                <img
                  src={item.outputToken_logo}
                  width={32}
                  alt={"inputToken_logo"}
                />
              </span>
            </div>
            <h3 className="text-3xl font-semibold leading-normal text-light-high md:text-lg">
              {item.inputToken}/{item.outputToken}
            </h3>
          </div>
          <Tooltip placement="top" overlay={<span>{item.platform}</span>}>
            <span className="flex hidden md:block">
              <img src={item.platform_logo} width={28} alt={"logo"} />
            </span>
          </Tooltip>
        </div>
        <div className="flex flex-wrap md:mb-2">
          <div className="md:hidden flex-1">
            {listData(
              "Platform",
              <>
                <span className="mr-2 flex">
                  <img src={item.platform_logo} width={28} alt={"logo"} />
                </span>
                {item.platform}
              </>
            )}
          </div>
          {item.type === "defi" ? (
            <>
              {listData("Swap Fee", `${item.fees}`)}
              {listData("Pool Liquidity", `$${item.pool_liquidity}`)}
            </>
          ) : (
            <>
              {listData("Borrowing APY", `${item.borrow_apy}%`)}
              {listData("Lending APY", `${item.lending_apy}%`)}
            </>
          )}
        </div>
      </div>
      <div className="w-[11.875rem] flex flex-col justify-center md:w-auto">
        {item.launched ? (
          item.type === "yield_farming" ? (
            <div className="flex flex-col justify-center mx-2.5 md:flex-row md:mx-0">
              <ButtonLink
                link={item.swap_link}
                target={"_blank"}
                className="button button-primary mb-3 md:py-2 md:px-4 md:text-xsm md:flex-1 md:mb-0 md:mr-2 pointer-events-none"
                content={<>Coming Soon</>}
              />
            </div>
          ) : item.type === "defi" ? (
            <div className="flex flex-col justify-center mx-2.5 md:flex-row md:mx-0">
              <ButtonLink
                link={item.swap_link}
                target={"_blank"}
                className="button button-primary mb-3 md:py-2 md:px-4 md:text-xsm md:flex-1 md:mb-0 md:mr-2"
                content={
                  <div className="flex justify-center items-center">
                    Swap
                    <Icon
                      iconName="arrow-redirect-white"
                      viewClass="redirect stroke-[#fcfcfc] !w-[10px] !h-[10px] ml-1"
                    />
                  </div>
                }
              />
              <ButtonLink
                link={item.swap_link}
                target={"_blank"}
                type="secondary"
                className="button button-primary px-4 md:py-2 md:px-4 md:text-xsm md:flex-1"
                content={
                  <div className="flex justify-center items-center">
                    Add Liquidity
                    <Icon
                      iconName="arrow-redirect-white"
                      viewClass="redirect stroke-[#fcfcfc] !w-[10px] !h-[10px] ml-1"
                    />
                  </div>
                }
              />
            </div>
          ) : (
            <div className="flex flex-col justify-center mx-2.5">
              <ButtonLink
                link={item.swap_link}
                target={"_blank"}
                className="button button-primary md:py-2 md:px-4 md:text-xsm"
                content={
                  <>
                    Borrow
                    <Icon
                      iconName="arrow-redirect-white"
                      viewClass="redirect"
                    />
                  </>
                }
              />
              <ButtonLink
                link={item.swap_link}
                target={"_blank"}
                className="button button-primary md:py-2 md:px-4 md:text-xsm"
                content={
                  <>
                    Lend
                    <Icon
                      iconName="arrow-redirect-white"
                      viewClass="redirect"
                    />
                  </>
                }
              />
            </div>
          )
        ) : (
          <div className="flex flex-col justify-center lg:mx-0 lg:mt-4 mx-2.5">
            <ButtonLink
              link={item.swap_link}
              target={"_blank"}
              className="button button-primary pointer-events-none opacity-50 md:py-2 md:px-4 md:text-xsm"
              content="Coming Soon"
            />
          </div>
        )}
      </div>
    </div>
  </div>
);

const CardList = ({ sortActive, allData, defiData, lendingData }: any) => {
  return (
    <div>
      {sortActive["all"] && allData.length ? (
        allData.length ? (
          allData.map((item: any, index: number) => listShow(item, index))
        ) : (
          <p className="empty-list">Data not found</p>
        )
      ) : (
        ""
      )}
      {defiData.length && sortActive["dexes"] ? (
        defiData.length ? (
          defiData.map((item: any, index: number) => listShow(item, index))
        ) : (
          <p className="empty-list">Data not found</p>
        )
      ) : (
        ""
      )}
      {lendingData.length && sortActive["lending"] ? (
        lendingData.length ? (
          lendingData.map((item: any, index: number) => listShow(item, index))
        ) : (
          <p className="empty-list">Data not found</p>
        )
      ) : (
        ""
      )}
    </div>
  );
};

export default CardList;
