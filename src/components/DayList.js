import React from "react";
import ReactDOM from "react-dom";
import DayListItem from "components/DayListItem";

export default function DayList(props) {

  let days = props.days.map((day) => {
    return (
      < DayListItem
        key={day.id}
        name={day.name}
        spots={day.spots}
        selected={day.name === props.day}
        setDay={props.setDay} />
    )
  })
  return days;
}


/* ReactDOM.render(
  <DayList
    days={days}
    day={tweet.avatar}
    content={tweet.content}
    date={tweet.date}
  />,
  document.getElementById("root")
); */