import React from "react";
import {Icon} from "../../atoms/icon";

const TransactionIcon = (stepNumber:number, value:number, txFailed:boolean)=>{
  return(
      stepNumber < value?
          <Icon
              iconName="success-circle"
              viewClass="icon-arrow fill-[#787878] !w-[1.5rem] !h-[1.5rem] md:!w-[1.3rem] md:!h-[1.3rem]"
          />
          :
          stepNumber === value ?
              txFailed ?
                  <Icon
                      iconName="error"
                      viewClass="icon-error  !w-[1.5rem] !h-[1.5rem] md:!w-[1.3rem] md:!h-[1.3rem]"
                  />
                  :
                  <div className="spinnerSecondary relative flex items-center justify-center
                  w-[1.5rem] h-[1.5rem] after:content-[''] after:absolute after:left-0
                after:top-0 after:w-full after:h-full md:!w-[1.3rem] md:!h-[1.3rem]">
                    <Icon
                        iconName="tick"
                        viewClass="icon-arrow fill-[#787878]"
                    />
                  </div>
              :
              <Icon
                  iconName="success-circle"
                  viewClass="icon-arrow fill-[#47C28B] !w-[1.5rem] !h-[1.5rem] md:!w-[1.3rem] md:!h-[1.3rem]"
              />
  )
}

export default TransactionIcon;
