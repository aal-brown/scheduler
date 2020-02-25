import React, { useReducer, useEffect } from "react";
import axios from "axios";


const socket = new WebSocket("ws://localhost:8001", )

//listen to socket events
socket.onopen = ()=>{
  /* console.log('socket successfully connected'); */
  socket.send("ping")
 };
 socket.onmessage = (event)=>{
 /*  console.log('Message Received: ', event);
  console.log('Data: ', event.data) */
  let receivedData = JSON.parse(event.data)

  let interviewData = receivedData.interview
 /*  console.log("interviewdata",interviewData) */

 };


 

export default function useApplicationData() {


  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";

function reducer(state, action) {
  switch (action.type) {
    case SET_DAY:
      return { ...state, day: action.day }

    case SET_APPLICATION_DATA:
      return {...state, days:action.days, appointments: action.appointments, interviewers: action.interviewers}

      //Change to only pass interview and ID
    case SET_INTERVIEW: {
      return {...state, appointments: action.appointments, days: action.spotsDays}
    }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}

  let today = new Date();
  const week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  /* day: week[today.getDay()], */
  
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
      
      dispatch({type: SET_APPLICATION_DATA, days:all[0].data,appointments:all[1].data, interviewers:all[2].data})
      })
  },[]);


  const setDay = (day) => dispatch({type: SET_DAY, day});

//GEt day of actual interveiw, not state.day
  function setSpots(change) {

    let dayIndex;

    for (let day of state.days) {
      if (day.name === state.day) {
        dayIndex = day.id - 1
      }
    }

   let spots = (state.days[dayIndex].spots)+change
   
   let newDay = {...state.days[dayIndex], spots: spots}
   let newDays = [...state.days]
    newDays[dayIndex] = newDay

    return newDays
  }

  function bookInterview(id, interview) {


    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    let spotsDays = setSpots(-1);

   return Promise.resolve(
      axios.put(`/api/appointments/${id}`,appointment)
      .then(() => {
        return dispatch({type: SET_INTERVIEW, appointments, spotsDays })
      })
    )
  }


//We need to go into the state, and set the appointment interview data to null for a matching ID
function cancelInterview(id) {
    
  //Here we get the appointment that matches the ID and set the interview equal to null
    const appointment = {...state.appointments[id], interview: null};

  //Here we then updater the appointments array to include our changed appointment.
    const appointments = {...state.appointments,[id]: appointment};

  //Then to render the changes and update the database (since the changes we have made so far are only local) we need to do the following:

  let spotsDays = setSpots(1)
   return Promise.resolve(
      axios.delete(`/api/appointments/${id}`)
      .then(() => {
        return dispatch({ type: SET_INTERVIEW, appointments, spotsDays})
      })
    )
  }


   return {state, setDay, bookInterview, cancelInterview}
  }