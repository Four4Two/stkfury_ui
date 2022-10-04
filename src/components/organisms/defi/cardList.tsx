import React from 'react';
import {Icon} from "../../atoms/icon";
import ButtonLink from "../../atoms/buttonLink";

const listData = (label:any, value:any) => (
    <div className="pr-5 flex-1 md:py-2">
        <p className="font-normal text-base
         leading-normal mb-2 text-light-emphasis lg:whitespace-nowrap ">
            {label}
        </p>
        <h3 className="font-medium text-base leading-normal text-light-mid whitespace-nowrap flex">
            {value}
        </h3>
    </div>
)

const listShow = (item:any, index:number) => (
    <div className="card-container mb-8" key={index}>
        <div className="card card-primary bg-[#28282880] p-8 rounded-md lg:block flex flex-wrap">
                <div className="content flex-1">
                    <div className="heading-section flex mb-8 md:mb-2">
                        <div className="icons relative flex items-center mr-8">
                            <span className="z-10 absolute flex">
                                <img
                                    src={item.inputToken_logo}
                                    width={32} height={32}
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
                    <div className="flex flex-wrap">
                        {listData('Platform',
                        <>
                            <span className="mr-2 flex">
                                    <img src={item.platform_logo}
                                           width={28}
                                           alt={"logo"}
                                    />
                                </span>
                            {item.platform}
                        </>)}
                        {item.type === "defi" ?
                            <>
                                {listData('APY', `${item.apy}%`)}
                                {listData('TVL', `$${item.tvl}`)}
                            </>
                            :
                            <>
                                {listData('Borrowing APY', `${item.borrow_apy}%`)}
                                {listData('Lending APY', `${item.lending_apy}%`)}
                            </>
                        }
                    </div>
                </div>
                <div className="w-[11.875rem] flex flex-col justify-center">
                {item.launched ?
                    item.type === "yield_farming" ?
                        <div className="flex flex-col justify-center mx-2.5">
                            <ButtonLink link={item.swap_link} target={"_blank"}
                               className="button button-primary"
                                content={
                                <>
                                    Start farming
                                    <Icon
                                        iconName="arrow-redirect-white"
                                        viewClass="redirect"
                                    />
                                </>
                                }
                            />
                        </div>
                        :
                        item.type === "defi" ?
                            <div className="flex flex-col justify-center mx-2.5">
                                <ButtonLink link={item.swap_link} target={"_blank"}
                                            className="button button-primary"
                                            content={
                                                <>
                                                    Swap
                                                    <Icon
                                                        iconName="arrow-redirect-white"
                                                        viewClass="redirect"
                                                    />
                                                </>
                                            }
                                />
                                <ButtonLink link={item.swap_link} target={"_blank"}
                                            className="button button-primary"
                                            content={
                                                <>
                                                    Add Liquidity
                                                    <Icon
                                                        iconName="arrow-redirect-white"
                                                        viewClass="redirect"
                                                    />
                                                </>
                                            }
                                />

                            </div>
                            :
                            <div className="flex flex-col justify-center mx-2.5">
                                <ButtonLink link={item.swap_link} target={"_blank"}
                                            className="button button-primary"
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
                                <ButtonLink link={item.swap_link} target={"_blank"}
                                            className="button button-primary"
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
                    : <div className="flex flex-col justify-center lg:mx-0 lg:mt-4 mx-2.5">
                        <ButtonLink link={item.swap_link} target={"_blank"}
                                    className="button button-primary pointer-events-none opacity-50"
                                    content="Coming Soon"
                        />
                    </div>
                }
                </div>
            </div>
    </div>
)

const CardList = ({sortActive, allData, defiData, lendingData}:any) => {
    return (
        <div>
            {
                (sortActive["all"] && allData.length) ?
                    allData.length ? allData.map((item:any, index:number) => (
                            listShow(item, index)
                        )) :
                        <p className="empty-list">Data not found</p>
                    : ""
            }
            {
                (defiData.length) && sortActive["dexes"] ?
                    defiData.length ? defiData.map((item:any, index:number) => (
                            listShow(item, index)
                        )) :
                        <p className="empty-list">Data not found</p>
                    : ""
            }
            {
                (lendingData.length) && sortActive["lending"] ?
                    lendingData.length ? lendingData.map((item:any, index:number) => (
                            listShow(item, index)
                        )) :
                        <p className="empty-list">Data not found</p>
                    : ""
            }
        </div>

    )
}

export default CardList;