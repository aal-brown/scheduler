import React from "react";
import interviewerlistitem from "components/InterviewerListItem.scss";

import classNames from 'classnames/bind';

let classnames = classNames.bind(interviewerlistitem);


export default function InterviewerListItem(props) {

  const interviewerClass = classnames("interviewers__item",{
    "interviewers__item--selected": props.selected,
    "interviewers__item-image": props.avatar,
    "interviewers__item--selected-image": props.selected && props.avatar
  });

  return (
    <li className={interviewerClass} onClick={props.setInterviewer}>
      <img
        className="interviewers__item-image"
        src={props.avatar}
        alt={props.name}
      />
      {props.selected && props.name}
    </li>
  );
}