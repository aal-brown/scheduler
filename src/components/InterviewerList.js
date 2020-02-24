import React from "react";
/* import ReactDOM from "react-dom"; */
import InterviewerListItem from "components/InterviewerListItem";
import interviewerlist from "components/InterviewerList.scss"
import PropTypes from 'prop-types';

/* import classNames from 'classnames/bind';

let classnames = classNames.bind(interviewerlist) */

InterviewerList.propTypes = {
  interviewer: PropTypes.number,
setInterviewer: PropTypes.func.isRequired,
}

export default function InterviewerList(props) {


/* const interviews = classnames("interviewers") */

  let interviewers = props.interviewers.map((interviewer) => {
    return (
        < InterviewerListItem
          key={interviewer.id}
          name={interviewer.name}
          avatar={interviewer.avatar}
          selected={interviewer.id === props.interviewer}
          setInterviewer={(event) => props.setInterviewer(interviewer.id)} />
    )
  })
  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">{interviewers}</ul>
    </section>
  )
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


/* <section className="interviewers">
<h4 className="interviewers__header text--light">{props.name}</h4>
<ul className="interviewers__list"></ul>
</section>
</Fragment> */