import React, { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css"
import { ModalTypes } from "./types";
import { emptyFunc } from "../../../helpers/utils";
import { Icon } from "../../atoms/icon";
import { hideDepositModal } from "../../../store/reducers/transactions/deposit";
import { useDispatch } from "react-redux";
import { useOnClickOutside } from "../../../customHooks/useOnClickOutside";

const Modal = ({ children, show, header, onClose = emptyFunc, className }: ModalTypes) => {
  // const modalRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();


  const modalRef = useOnClickOutside(onClose)
  // useEffect(() => {
  //   function handler(event:MouseEvent | TouchEvent) {
  //     if (show && modalRef.current && !modalRef.current.contains(event.target as Node)) {
  //         dispatch(hideDepositModal())
  //     }
  //   }
  //   document.addEventListener("mousedown", handler)
  //   return () => {
  //     document.removeEventListener("mousedown", handler)
  //   }
  // }, [dispatch, show])


  return (
    <div className={`${show ? 'block': 'hidden'}`}>
      <div className={`${styles.backDrop} fixed top-0 right-0 z-10 left-0 w-full h-full`}/>
      <div className={`modal fixed top-0 right-0 left-0 w-full h-full z-20 overflow-auto `+styles.modal+` ${className}`}>
       <div className={`${styles.modalDialog} flex items-center min-h-full w-auto m-auto relative modalDialog`} >
         <div className={`${styles.modalContent} relative flex flex-col w-full rounded-lg text-light-mid modalContent`} ref={modalRef}>
         <button type="button" onClick={onClose} className={`${styles.buttonClose} buttonClose`}>
           <Icon iconName="close" viewClass={styles.buttonCloseIcon}/>
         </button>
         {
           header ?
             <div className="header text-2xl text-light-high font-semibold flex justify-between items-start px-8 pt-8 rounded-t dark:border-gray-600">
               <p>{header}</p>
             </div> : ""
         }
         <div className="modal-body p-8 space-y-6">
           {children}
         </div>
     </div>
     </div>
    </div>

    </div>
  );
};


export default Modal;
