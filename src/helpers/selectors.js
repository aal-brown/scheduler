export function getAppointmentsForDay(state, day) {
  
  let filteredDay = state.days.filter((item) => {
    
    if (item.name === day) {
      return item;
    }
  })[0];
  
  let appointments = [];

  if (filteredDay && filteredDay.appointments.length > 0) {
    appointments = filteredDay.appointments.map((item) => {
      if (state.appointments[item]) {
        return (state.appointments[item]);
      }
    });
  }
  return appointments;
}


export function getInterview(state, interview) {
  
  let interviewerObj;

  if (interview) {
    if (state.interviewers[interview.interviewer]) {
      interviewerObj = state.interviewers[interview.interviewer];
    }
  } else {
    return null;
  }
  
  return {...interview, interviewer: interviewerObj};
}



export function getInterviewersForDay(state, day) {

  let filteredDay = state.days.filter((item) => {
    
    if (item.name === day) {
      return item;
    }
  })[0];
  
  let interviewers = [];
  
  if (filteredDay && filteredDay.interviewers.length > 0) {
    interviewers = filteredDay.interviewers.map((item) => {
      if (state.interviewers[item]) {
        return (state.interviewers[item]);
      }
    });
  }

  return interviewers;
}