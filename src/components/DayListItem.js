import React from "react";
import daylistitem from "components/DayListItem.scss"

import classNames from 'classnames/bind';

let classnames = classNames.bind(daylistitem);


const formatSpots = function(props) {
  let strAdder = "";
  if (props.spots > 1) {
    strAdder = `${props.spots} spots remaining`
  } else if (props.spots === 1) {
    strAdder = `${props.spots} spot remaining`
  } else {
    strAdder = "no spots remaining"
  }
  return strAdder;
}

export default function DayListItem(props) {

/*   let stringVar = ""
  if (props.selected && props.spots > 0) {
    stringVar = "__item--selected"
  } else if (props.selected) {
    stringVar = "__item--full"
  } else {
    stringVar = "__item"
  } */

  const dayClass = classnames("day-list__item",{
    "day-list__item--selected": props.selected,
    "day-list__item--full": props.spots === 0
  });

  return (
    <li className={dayClass} data-testid="day" onClick={() => props.setDay(props.name)}>
      <h2 className="text--light">{props.name}</h2> 
      <h3 className="text--regular">{formatSpots(props)}</h3>
    </li>
  );
}