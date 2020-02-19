import React from "react";

import button_css from "components/Button.scss";

import classNames from 'classnames/bind';

let classnames = classNames.bind(button_css);

export default function Button(props) {
   const buttonClass = classnames("button", {
     "button--confirm": props.confirm,
     "button--danger": props.danger
   });
  
   return (
     <button
       className={buttonClass}
       onClick={props.onClick}
       disabled={props.disabled}
     >
      {props.children}
   </button>
      );
 }
