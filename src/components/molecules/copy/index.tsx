import {CopyToClipboard} from 'react-copy-to-clipboard';
import React, {useState} from 'react';
import { Icon } from "../../atoms/icon";
import Styles from "./styles.module.css"
import { IconTypes } from "./types";

const Copy = ({ id }: IconTypes) => {
  const [copyValue, setCopyValue] = useState(false);
  const onCopy = () => {
    setCopyValue(true);
    setTimeout(() => {
      setCopyValue(false);
    }, 1000);
  };
  return (
    <div className="relative flex">
      <CopyToClipboard onCopy={onCopy} text={id}>
        <button className={Styles.copyButton}>
          <Icon
          viewClass={Styles.copyIcon}
          iconName="copy"/>
        </button>
      </CopyToClipboard>
      <section className={`${Styles.copyResult} absolute`}>
        {copyValue ? <span>Copied</span> : null}
      </section>
    </div>
  );
};


export default Copy;
