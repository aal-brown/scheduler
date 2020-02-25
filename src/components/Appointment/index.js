import React from "react";
import Header from "./Header.js"
import Show from "./Show.js"
import Empty from "./Empty.js"
import Form from "./Form.js"
import Status from "./Status.js"
import Confirm from "./Confirm.js"
import Error from "./Error.js"


import Appointment_css from "./styles.scss";

import useVisualMode from "../../hooks/useVisualMode.js"

export default function Appointment(props) {
  
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const CONFIRM = "CONFIRM";
  const DELETING = "DELETING";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE"
  const ERROR_DELETE = "ERROR_DELETE"

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );
  
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING)
    props.bookInterview(props.id, interview)
    .then(() => transition(SHOW))
    .catch(() => transition(ERROR_SAVE))
  }
  
  function cancel() {
    transition(DELETING, true)
    props.cancelInterview(props.id)
    .then(() => transition(EMPTY))
    .catch((err) => transition(ERROR_DELETE))
  }
  
  return (
    <article className="appointment" data-testid="appointment">
      <Header>{props.time}</Header>
      {mode === EMPTY && <Empty onAdd = {() => {return transition(CREATE)}} />}
      {mode === SHOW && (
      <Show
        student={props.interview.student}
        interviewer={props.interview.interviewer}
        onEdit={() => transition(EDIT)}
        onDelete={() => transition(CONFIRM)}
      />
      )}
      {mode === CREATE && (<Form
        onSave={save}
        onCancel={() => {transition(EMPTY)}}
        interviewers={props.interviewers}
        />)}
      {mode === SAVING && (<Status
      message="Saving"
      />)}
      {mode === DELETING && (<Status
      message="Deleting"
      />)}
      {mode === CONFIRM && (<Confirm
        message="Are you sure you want to delete the appointment?"
        onCancel={() => transition(SHOW)}
        onConfirm={cancel}
      />)}
      {mode === EDIT && (<Form
        name={props.interview.student}
        interviewer={props.interview.interviewer}
        onEdit={() => transition(CREATE)}
        onSave={save}
        onCancel={() => transition(SHOW)}
        interviewers={props.interviewers}
      />)}
      {mode === ERROR_SAVE && (<Error
        message="There was an error saving the appointment"
        onClose={() => transition(CREATE, true)}
      />)}
      {mode === ERROR_DELETE && (<Error
      message="There was an error deleting the appointment"
        onClose={() => transition(SHOW, true)}
      />)}
      </article>
    )
}
