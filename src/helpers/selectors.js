import React from "react";

export function getAppointmentsForDay(state, day) {
  

  let filteredDay = state.days.filter((item) => {
    
    if (item.name === day) {
      return item;
    }
  })[0]

  
  let appointments = [];
  

  if (filteredDay && filteredDay.appointments.length > 0) {
    appointments = filteredDay.appointments.map((item) => {
      if(state.appointments[item]) {
        return (state.appointments[item])
      }
    })
  }
  
  return appointments;
}

/* 
We will receive state, that has an object of appointments that don't list an interviewer, just an ID, so what we will do is go through the appointments data and find the interviewer id, then we will go and find the corresponding object in our interviewers array. It will take this object and put it into.
Get the object

 */

export function getInterview(state, interview) {
  let interviewerObj;

  if (interview) {
    if (state.interviewers[interview.interviewer]) {
      interviewerObj = state.interviewers[interview.interviewer];
    }
     interview.interviewer = interviewerObj
  } else {
    interviewerObj = null;
  }
    
  return interview;
}