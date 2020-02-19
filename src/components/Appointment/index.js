import React from "react";
import Header from "./Header.js"
import Show from "./Show.js"
import Empty from "./Empty.js"

import Appointment_css from "./styles.scss";

export default function Appointment(props) {
  
  if (props.interview) {
   return ( 
    <article className="appointment">
      <Header>{props.time}</Header>
      <Show 
        student={props.interview.student}
        interviewer={props.interview.interviewer}
        />
    </article>
   )
  } else { 
  return (
    <article className="appointment">
      <Header>{props.time}</Header>
      <Empty />
  </article>
  )
  }
}
