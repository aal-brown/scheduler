import React, { useReducer, useEffect } from "react";
import axios from "axios";

import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW
} from "reducers/application";

const socket = new WebSocket("ws://localhost:8001",);

//listen to socket events
socket.onopen = ()=>{
  
  socket.send("ping");
};
socket.onmessage = (event)=>{

  let receivedData = JSON.parse(event.data);

  let interviewData = receivedData.interview;

};


 

export default function useApplicationData() {

  const [state, dispatch] = useReducer(reducer,{
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ])
      .then((all) => {
      
        dispatch({type: SET_APPLICATION_DATA, days:all[0].data,appointments:all[1].data, interviewers:all[2].data});
      });
  },[]);


  const setDay = (day) => dispatch({type: SET_DAY, day});

  function setSpots(change) {

    let dayIndex;

    for (let day of state.days) {
      if (day.name === state.day) {
        dayIndex = day.id - 1;
      }
    }

    let spots = (state.days[dayIndex].spots) + change;
   
    let newDay = {...state.days[dayIndex], spots: spots};
    let newDays = [...state.days];
    newDays[dayIndex] = newDay;

    return newDays;
  }

  function bookInterview(id, interview) {

    let spotsDays;

    if (!state.appointments[id].interview) {
      spotsDays = setSpots(-1);
    } else {
      spotsDays = setSpots(0);
    }

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return Promise.resolve(
      axios.put(`/api/appointments/${id}`,appointment)
        .then(() => {
          return dispatch({type: SET_INTERVIEW, appointments, spotsDays });
        })
    );
  }


  //We need to go into the state, and set the appointment interview data to null for a matching ID
  function cancelInterview(id) {
    
    //Here we get the appointment that matches the ID and set the interview equal to null
    const appointment = {...state.appointments[id], interview: null};

    //Here we then updater the appointments array to include our changed appointment.
    const appointments = {...state.appointments,[id]: appointment};

    //Then to render the changes and update the database (since the changes we have made so far are only local) we need to do the following:

    let spotsDays = setSpots(1);
    return Promise.resolve(
      axios.delete(`/api/appointments/${id}`)
        .then(() => {
          return dispatch({ type: SET_INTERVIEW, appointments, spotsDays});
        })
    );
  }


  return {state, setDay, bookInterview, cancelInterview};
}