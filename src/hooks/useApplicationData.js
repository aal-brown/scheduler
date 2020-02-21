import React, { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {


  let today = new Date();
  const week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  const [state, setState] = useState({
    day: week[today.getDay()],
    days: [],
    appointments: {},
    interviewers: {}
  });

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8001/api/days"),
      axios.get("http://localhost:8001/api/appointments"),
      axios.get("http://localhost:8001/api/interviewers")
    ])
    .then((all) => {
      setState((prev) => (
        {prev, days:all[0].data,appointments:all[1].data, interviewers:all[2].data}))
      })
  },[]);


  const setDay = (day) => setState(prev => ({...prev, day }));


  function bookInterview(id, interview) {
  
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

   return Promise.resolve(
      axios.put(`http://localhost:8001/api/appointments/${id}`,appointment)
      .then(() => {
        return setState({...state,appointments})
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
   return Promise.resolve(
      axios.delete(`http://localhost:8001/api/appointments/${id}`)
      .then(() => {
        return setState({...state,appointments})
      })
    )
  }


   return {state, setDay, bookInterview, cancelInterview}
  }