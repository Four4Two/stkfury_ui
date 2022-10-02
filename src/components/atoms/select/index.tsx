import React, { useState } from "react";
import { MenuSelectProps } from "./types";
import {useMediaQuery} from "react-responsive";

export const Select = ({
                          selectedOption,
                          options,
                          onSelect
                      }: MenuSelectProps) => {

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const isMobile = useMediaQuery({query: '(max-width: 768px)'});

    return (
      <div className="flex w-fit cursor-pointer">
      <button
        className="flex items-center"
        onClick={(e) => {
          e.stopPropagation();
          setDropdownOpen(!dropdownOpen);
        }}
      >
          <span className="block m-auto md:mx-1 mx-2 leading-loose text-secondary-200 min-w-[3.75rem] select-none text-center text-ellipsis font-semibold overflow-hidden md:caption">
            {selectedOption
              ? selectedOption
              : ""}
          </span>
      </button>
        {isMobile ?
          <p>Mobile</p>
          : <p>Not MOBILE</p>
        }
      </div>
    )
}

export default Select