import React, { useState, useEffect } from "react";
import axios from "axios";

import "components/Application.scss";

import Appointment from "./Appointment/index.js"

import DayList from "components/DayList"

import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";



export default function Application(props) {

  let today = new Date();
  const week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  const [state, setState] = useState({
    day: week[ today.getDay() ],
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = (day) => setState(prev => ({...prev, day }));
 /*  const setDays = (days) => setState((prev) => ({ ...prev, days })); */

  /*   const [day, setDay] = useState("monday")
  const [days, setDays] = useState([]) */

  const appointments = getAppointmentsForDay(state,state.day)
  
  function bookInterview(id, interview) {
  
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };


/*   setState({...state, appointments}) */

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
    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    console.log("appointment",appointment)
  //Here we then updater the appointments array to include our changed appointment.
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

//Finally we update the state with this information
  /* setState({...state, appointments}) */

  //Then to render the changes and update the database (since the changes we have made so far are only local) we need to do the following:
   return Promise.resolve(
    axios.delete(`http://localhost:8001/api/appointments/${id}`)
    .then(() => {
      return setState({...state,appointments})
    })
   )
  }

  const schedule = appointments.map((appointment) => {
    
    const interview = getInterview(state, appointment.interview);
    const interviewers = getInterviewersForDay(state, state.day)
    
    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        interviewers={interviewers}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
      />
    );
  });



 
  useEffect(() => {
    Promise.all([
    axios.get("http://localhost:8001/api/days"),
      axios.get("http://localhost:8001/api/appointments"),
      axios.get("http://localhost:8001/api/interviewers")
    ])
    .then((all) => {
      setState((prev) => ({prev, days:all[0].data,appointments:all[1].data, interviewers:all[2].data}))
    })
  },[]);


  return (
    <main className="layout">
      <section className="sidebar">
      <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            day={state.day}
            setDay={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {schedule}
          <Appointment key="last" time="5pm" />
      </section>
    </main>
  )}
