import React, {useEffect, useState} from "react";
import { Icon } from "../../atoms/icon";


const Banner = () => {
    const [show, setShow] = useState(true);
    return (
        <div className={`${show ? 'flex' : 'hidden'} bg-[#FEE2D5] mb-2 px-4 py-2 items-center justify-between`}>
            <div className="text-center mr-4">
                <p className="text-[#DB2438] text-xsm">
                    Unstaking has been temporarily disabled due to intermittent failures. Please use Instant Redemption
                    or swap your stkFURY on a decentralized exchange instead.
                </p>
            </div>
            <div onClick={()=>{setShow(false)}} className='cursor-pointer mr-2'>
                <Icon
                    iconName="close"
                    viewClass="fill-[#DB2438] !w-[12px] !h-[12px]"
                />
            </div>
        </div>
    );
};

export default Banner;
