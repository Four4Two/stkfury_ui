import { NextPage } from "next";

const Maintenance: NextPage = () => (
    <div className="bg-background flex gap-3 justify-center items-center h-screen px-4">
        <div className={"text-center max-w-[616px]"}>
            <img src={"/images/caution.svg"} alt={'caution'} className="m-auto w-[86px]"/>
            <h6 className='text-light-high text-3xl font-normal md:text-lg md:text-lg py-8'>{'We\'ll back soon'}</h6>
            <p className="font-normal text-sm leading-7 text-light-emphasis mb-4">
                Sorry for the inconvenience. We’re performing some maintenance at the moment. If you need to you can always
                follow us on <a href={"https://twitter.com/pstake_cosmos?s=11&t=E_q2T3rK9Bwiywy_YCvo5A"} className="text-[#c73238] font-semibold">
                Twitter</a> for updates, otherwise we’ll be back up shortly!</p>
            <p className="text-light-emphasis text-base font-semibold leading-normal mb-4">— The Persistence Team</p>
        </div>
    </div>
);

export default Maintenance;
