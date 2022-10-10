import React from "react";
import Sidebar from "./index";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/reducers";
import { hideMobileSidebar } from "../../../store/reducers/sidebar";
import { useOnClickOutside } from "../../../customHooks/useOnClickOutside";

const MobileSideBar = () => {
  const dispatch = useDispatch();
  const {show} = useSelector((state:RootState) => state.mobileSidebar);

  const closeHandler = () =>{
    dispatch(hideMobileSidebar());
  }

  const sideBarRef = useOnClickOutside(closeHandler)

  return(
    <div className={`${show ? "show":"close"} offCanvas hidden md:block `}>
      <div className={`backDrop fixed top-0 right-0 z-10 left-0 w-full h-full`}/>
      <div className={`fixed z-40 bg-side-bar`} ref={sideBarRef}>
        <Sidebar />
      </div>
    </div>
  )
}

export default MobileSideBar;